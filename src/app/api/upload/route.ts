import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToSpaces } from "@/lib/storage";

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large" }, { status: 400 });
  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${Date.now()}-${safeName}`;

  try {
    const url = await uploadToSpaces(bytes, key, file.type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("DigitalOcean Spaces upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
