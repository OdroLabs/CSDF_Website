import { Inbox } from "lucide-react";

/**
 * Shown in place of a list when nothing is published. The message itself is set
 * per page in Site Settings → Other Pages; leaving it blank renders nothing at
 * all, so the section collapses away completely.
 */
export function EmptyState({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground/40" />
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
