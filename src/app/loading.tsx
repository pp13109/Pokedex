export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <section className="space-y-6">
        <div className="h-6 w-40 animate-pulse rounded-full bg-zinc-800" />
        <div className="space-y-3">
          <div className="h-10 w-56 animate-pulse rounded-2xl bg-zinc-800" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-zinc-900" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/80"
            />
          ))}
        </div>
      </section>
    </main>
  )
}