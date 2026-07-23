import { cn } from "@/lib/utils";

export function Section({
  eyebrow,
  title,
  children,
  className,
  center,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section className={cn("container py-12 md:py-16", className)}>
      {(eyebrow || title) && (
        <div className={cn("mb-8 max-w-3xl", center && "mx-auto text-center")}>
          {eyebrow && (
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
          )}
          {title && <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}
