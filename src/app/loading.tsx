export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <section className="space-y-8">
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-zinc-800" />
          <div className="h-12 w-56 animate-pulse rounded-2xl bg-zinc-800" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-zinc-900" />
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
                  <div className="h-6 w-28 animate-pulse rounded bg-zinc-800" />
                </div>

                <div className="h-20 w-20 animate-pulse rounded-2xl bg-zinc-800" />
              </div>

              <div className="mb-5 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
              </div>

              <div className="h-10 w-28 animate-pulse rounded-full bg-zinc-700" />
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}