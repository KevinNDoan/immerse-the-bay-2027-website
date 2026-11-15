export default function Home() {
  return (
    <div className="flex min-h-svh flex-col px-6 sm:px-12">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-foreground/15 py-7">
        <span className="text-sm font-semibold tracking-tight">
          Immerse the Bay
        </span>
        <span className="text-sm text-foreground/70">2027</span>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center py-24 sm:py-32">
        <p className="mb-8 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#517951]" />
          A new chapter
        </p>
        <h1 className="max-w-4xl text-6xl leading-[1.02] font-medium tracking-[-0.06em] sm:text-8xl lg:text-9xl">
          Immerse
          <br />
          the Bay<span className="text-[#718e68]">.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl">
          Our 2027 website is on its way.
          <br />
          More details coming soon.
        </p>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-foreground/15 py-6 text-xs text-foreground/70">
        <span>Immerse the Bay 2027</span>
        <span>See you soon.</span>
      </footer>
    </div>
  );
}
