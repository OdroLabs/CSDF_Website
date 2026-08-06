import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/storage";

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB — the actual ceiling now lives with Spaces, not a serverless function body limit.
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

/**
 * Returns a short-lived presigned PUT URL for Spaces so the browser can
 * upload the file directly, instead of routing the bytes through this
 * serverless function (which Vercel caps at ~4.5 MB regardless of our own
 * MAX_SIZE check). This request body is tiny — just filename/type/size —
 * so it never runs into that limit itself.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const filename = body?.filename as string | undefined;
  const contentType = body?.contentType as string | undefined;
  const size = Number(body?.size ?? 0);

  if (!filename || !contentType) {
    return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
  }
  if (size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 25 MB)" }, { status: 400 });
  }
  if (!ALLOWED.includes(contentType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${Date.now()}-${safeName}`;

  try {
    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Failed to create presigned upload URL:", error);
    return NextResponse.json({ error: "Could not prepare upload" }, { status: 502 });
  }
}
