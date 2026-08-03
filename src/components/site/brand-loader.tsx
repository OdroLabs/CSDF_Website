/** CSDF wordmark with a growing underline bar — used as the loading indicator. */
export function BrandLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={className ?? "flex flex-col items-center gap-3"}>
      <span className="text-3xl font-bold tracking-tight text-foreground">CSDF</span>
      <span className="block h-[3px] w-24 overflow-hidden rounded-full bg-muted">
        <span className="block h-full w-0 animate-line-grow rounded-full bg-primary" />
      </span>
    </div>
  );
}
