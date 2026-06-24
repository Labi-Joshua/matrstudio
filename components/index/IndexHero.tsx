export function IndexHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-[16px] md:pt-[40px] pb-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
        <div className="flex-[3]">
          <h1 className="font-display text-[54px] md:text-[64px] leading-[1.1] tracking-[-2px] text-foreground">
            Curated Design<br className="hidden md:block" /> Resources for<br className="hidden md:block" /> the Modern Craft<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            A curated library of tools, frameworks, resources, and insights for designers who care about the craft. Find what you need to build, execute, and grow.
          </p>
        </div>
        <div className="w-[546px] h-[508px] overflow-hidden shrink-0">
          <img
            src="/hero-illustration.svg"
            alt="Matr Studio illustration"
            className="w-[120%] h-auto max-w-none -ml-[5%]"
          />
        </div>
      </div>
    </section>
  )
}
