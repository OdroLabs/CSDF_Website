"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { cn, withMinDelay } from "@/lib/utils";
import { useToast } from "./toast";

/** The editor emits "<p></p>" for an empty document — store nothing instead. */
function normalise(html: string): string {
  if (/<(img|hr|table)\b/i.test(html)) return html;
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
  return text === "" ? "" : html;
}

function ToolButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md transition-colors disabled:opacity-30",
        active
          ? "bg-primary text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-6 w-px shrink-0 bg-border" />;
}

function Toolbar({
  editor,
  onPickImage,
  uploading,
}: {
  editor: Editor;
  onPickImage: () => void;
  uploading: boolean;
}) {
  const setLink = useCallback(() => {
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link address (leave empty to remove)", current ?? "https://");
    if (href === null) return;
    if (href.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border-b bg-muted/40 p-1.5">
      <ToolButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Bulleted list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Align centre"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton title="Add or edit link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Link2Off className="h-4 w-4" />
      </ToolButton>
      <ToolButton title="Insert image" disabled={uploading} onClick={onPickImage}>
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
      </ToolButton>
      <ToolButton
        title="Divider line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <Eraser className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </ToolButton>
    </div>
  );
}

/**
 * Rich HTML editor for long-form content.
 *
 * The markup is kept in a hidden input so the surrounding form posts it like
 * any other field. Whatever is submitted is re-sanitised on the server against
 * an allowlist, so the editor is a convenience rather than a trust boundary.
 */
export function RichTextField({
  name,
  defaultValue,
  placeholder = "Start writing…",
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast, update } = useToast();

  const editor = useEditor({
    // Required in Next.js — rendering on the server causes a hydration mismatch.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[16rem] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => setHtml(normalise(editor.getHTML())),
  });

  async function handleFile(file: File) {
    if (!editor) return;
    setUploading(true);
    const toastId = toast({ title: `Uploading ${file.name}…`, variant: "loading" });
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await withMinDelay(fetch("/api/upload", { method: "POST", body: fd }));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      const alt = window.prompt("Describe this image for screen readers (optional)", "") ?? "";
      editor.chain().focus().setImage({ src: data.url, alt }).run();
      setHtml(normalise(editor.getHTML()));
      update(toastId, { title: "Image inserted", variant: "success" });
    } catch (e: any) {
      update(toastId, {
        title: "Upload failed",
        description: e?.message ?? "Could not upload that file.",
        variant: "error",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={html} />

      <div className="overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring">
        {editor ? (
          <>
            <Toolbar
              editor={editor}
              uploading={uploading}
              onPickImage={() => fileRef.current?.click()}
            />
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="grid min-h-[16rem] place-items-center text-xs text-muted-foreground">
            Loading editor…
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // Allow picking the same file again.
          e.target.value = "";
        }}
      />

      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Images are uploaded to this site. Paste from Word or Google Docs and the formatting is
        cleaned up automatically.
      </p>
    </div>
  );
}
