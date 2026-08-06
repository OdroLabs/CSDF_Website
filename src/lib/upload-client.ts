"use client";

/** Reads a response as JSON, but never throws a raw "Unexpected token" parse
 *  error if the server (or a platform in front of it) replied with plain
 *  text/HTML instead — e.g. Vercel's own "Request Entity Too Large" page. */
async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text.slice(0, 200) || `Request failed (${res.status})` };
  }
}

/**
 * Uploads a file straight to DigitalOcean Spaces from the browser via a
 * short-lived presigned URL, instead of sending the raw bytes through our
 * own API route. Files larger than ~4.5 MB used to fail with a confusing
 * JSON-parse error because Vercel rejects oversized serverless function
 * bodies with a plain-text response before our code ever ran.
 */
export async function uploadDirectToSpaces(file: File): Promise<string> {
  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
  });
  const presignData = await safeJson(presignRes);
  if (!presignRes.ok) throw new Error(presignData.error ?? "Upload failed");

  const putRes = await fetch(presignData.uploadUrl, {
    method: "PUT",
    headers: {
      "x-amz-acl": "public-read",
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!putRes.ok) {
    const body = await putRes.text().catch(() => "");
    throw new Error(`Upload failed (${putRes.status}): ${body.slice(0, 200) || "Storage rejected the file."}`);
  }

  return presignData.publicUrl;
}
