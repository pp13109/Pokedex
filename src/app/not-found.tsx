import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          404
        </p>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            No encontramos esa página
          </h1>

          <p className="max-w-xl text-zinc-400">
            El recurso que intentaste visitar no existe o todavía no está
            implementado.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  )
}