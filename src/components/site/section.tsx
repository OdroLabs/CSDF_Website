import { cn } from "@/lib/utils";
import { FadeIn } from "./motion";

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
    <section className={cn("container py-16 md:py-24", className)}>
      {(eyebrow || title) && (
        <FadeIn className={cn("mb-10 max-w-3xl", center && "mx-auto text-center")}>
          {eyebrow && (
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          )}
          {title && <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>}
        </FadeIn>
      )}
      {children}
    </section>
  );
}
