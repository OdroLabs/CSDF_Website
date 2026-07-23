export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="bg-gradient-to-r from-brand-950 to-teal-900 py-12 text-white md:py-16">
      <div className="container">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-white/80">{intro}</p>}
      </div>
    </section>
  );
}
