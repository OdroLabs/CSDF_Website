"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEntity } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ slug, id }: { slug: string; id: number }) {
  const [deleting, setDeleting] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive"
      disabled={deleting}
      onClick={async () => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        setDeleting(true);
        try {
          await deleteEntity(slug, id);
        } finally {
          setDeleting(false);
        }
      }}
      aria-label="Delete"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
