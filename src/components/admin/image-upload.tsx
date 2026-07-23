"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUploadField({
  name,
  defaultValue,
  accept = "image/*",
  isImage = true,
}: {
  name: string;
  defaultValue?: string | null;
  accept?: string;
  isImage?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUrl(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="flex items-center gap-3">
          {isImage ? (
            <div className="relative h-20 w-28 overflow-hidden rounded-md border">
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-primary underline"
            >
              <FileText className="h-4 w-4" /> {url.split("/").pop()}
            </a>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => setUrl("")}>
            <X className="h-3.5 w-3.5" /> Remove
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
