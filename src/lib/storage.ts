import { createHash, createHmac } from "crypto";

/**
 * DigitalOcean Spaces uploader.
 *
 * Spaces is S3-compatible, so uploads are just a signed (SigV4) HTTPS PUT —
 * no AWS SDK dependency required. All project uploads are written under the
 * `CSDF/` prefix inside the shared `ngowebsites` space so they stay separate
 * from other sites using the same bucket.
 *
 * Required env vars (see .env):
 *   DO_ACCESS_KEY_ID, DO_SECRET_ACCESS_KEY, DO_SPACE,
 *   DO_ENDPOINT      e.g. https://ngowebsites.sfo3.digitaloceanspaces.com
 *   DO_CDN_ENDPOINT  e.g. https://ngowebsites.sfo3.cdn.digitaloceanspaces.com
 */

const PROJECT_PREFIX = "CSDF";
const SERVICE = "s3";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/** Region is read from the endpoint hostname (…\.<region>\.digitaloceanspaces.com) since
 *  that's what Spaces actually validates the signature against. Falls back to
 *  DO_DEFAULT_REGION if the endpoint doesn't match the expected shape. */
function resolveRegion(endpoint: string): string {
  const match = endpoint.match(/^https?:\/\/[^./]+\.([a-z0-9-]+)\.digitaloceanspaces\.com/i);
  return match?.[1] ?? process.env.DO_DEFAULT_REGION ?? "us-east-1";
}

/** Percent-encodes a single path segment per the AWS SigV4 spec (RFC 3986 unreserved chars kept as-is). */
function uriEncode(segment: string): string {
  return encodeURIComponent(segment).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

/** Uploads a buffer to `CSDF/<key>` in the configured Space and returns its public CDN URL. */
export async function uploadToSpaces(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const accessKeyId = env("DO_ACCESS_KEY_ID");
  const secretAccessKey = env("DO_SECRET_ACCESS_KEY");
  const endpoint = env("DO_ENDPOINT").replace(/\/+$/, "");
  const cdnEndpoint = env("DO_CDN_ENDPOINT").replace(/\/+$/, "");
  const region = resolveRegion(endpoint);

  const objectKey = `${PROJECT_PREFIX}/${key}`.replace(/\/{2,}/g, "/");
  const host = new URL(endpoint).host;
  const canonicalUri = "/" + objectKey.split("/").map(uriEncode).join("/");

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(buffer);

  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-acl:public-read\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-acl;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "", // no query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`${endpoint}${canonicalUri}`, {
    method: "PUT",
    headers: {
      Host: host,
      "x-amz-acl": "public-read",
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`DigitalOcean Spaces upload failed (${res.status}): ${body.slice(0, 500)}`);
  }

  return `${cdnEndpoint}/${objectKey}`;
}

/**
 * Builds a SigV4 presigned PUT URL so the browser can upload a file straight
 * to Spaces, bypassing our own serverless function. Needed because Vercel
 * caps the request body of a Node.js serverless function at ~4.5 MB — a
 * limit larger PDFs/images blow past long before reaching our route, and the
 * platform's rejection (a plain-text "Request Entity Too Large") isn't JSON,
 * which is what broke the admin upload UI. Query-string ("presigned URL")
 * signing is used instead of the header-based signing in `uploadToSpaces`
 * because there's no request body available yet to hash at generation time.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresSeconds = 120
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const accessKeyId = env("DO_ACCESS_KEY_ID");
  const secretAccessKey = env("DO_SECRET_ACCESS_KEY");
  const endpoint = env("DO_ENDPOINT").replace(/\/+$/, "");
  const cdnEndpoint = env("DO_CDN_ENDPOINT").replace(/\/+$/, "");
  const region = resolveRegion(endpoint);

  const objectKey = `${PROJECT_PREFIX}/${key}`.replace(/\/{2,}/g, "/");
  const host = new URL(endpoint).host;
  const canonicalUri = "/" + objectKey.split("/").map(uriEncode).join("/");

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${SERVICE}/aws4_request`;
  const signedHeaders = "host;x-amz-acl";

  const query: [string, string][] = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${accessKeyId}/${credentialScope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(expiresSeconds)],
    ["X-Amz-SignedHeaders", signedHeaders],
  ];
  const canonicalQuery = query
    .slice()
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([k, v]) => `${uriEncode(k)}=${uriEncode(v)}`)
    .join("&");

  const canonicalHeaders = `host:${host}\nx-amz-acl:public-read\n`;

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  const uploadUrl = `${endpoint}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;

  return { uploadUrl, publicUrl: `${cdnEndpoint}/${objectKey}` };
}
