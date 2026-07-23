export function PageHero({
  title,
  intro,
  eyebrow,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white md:py-20">
      {/* Subtle corporate grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="container relative">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-200">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-white/80 md:text-lg">{intro}</p>}
        <span className="mt-6 block h-1 w-16 rounded-full bg-accent" />
      </div>
    </section>
  );
}
