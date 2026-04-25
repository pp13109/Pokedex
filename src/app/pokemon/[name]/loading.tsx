export default function PokemonDetailLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <div className="mb-8 h-5 w-40 animate-pulse rounded bg-zinc-800" />

      <article className="grid gap-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="mx-auto h-64 w-64 animate-pulse rounded-3xl bg-zinc-800" />
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="h-12 w-48 animate-pulse rounded-2xl bg-zinc-800" />
            <div className="flex gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-800" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-800" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-zinc-800" />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-zinc-800" />
            </div>
          </section>

          <section className="space-y-4">
            <div className="h-7 w-32 animate-pulse rounded bg-zinc-800" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
                >
                  <div className="h-5 w-24 animate-pulse rounded bg-zinc-800" />
                  <div className="mt-2 h-4 w-28 animate-pulse rounded bg-zinc-900" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}