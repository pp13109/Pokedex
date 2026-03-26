export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="space-y-6">
        <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
          Fase 1 · Fundaciones
        </span>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pokédex
          </h1>

          <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Base inicial del proyecto. En las siguientes fases construiremos la
            arquitectura, la capa de datos y la interfaz.
          </p>
        </div>
      </section>
    </main>
  )
}
