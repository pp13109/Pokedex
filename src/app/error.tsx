'use client'

import { useEffect } from 'react'

type GlobalErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="space-y-6">
        <span className="inline-flex rounded-full border border-red-900/60 bg-red-950/30 px-3 py-1 text-sm text-red-200">
          Error inesperado
        </span>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Algo salió mal
          </h1>

          <p className="max-w-2xl text-zinc-400">
            Ocurrió un problema inesperado al renderizar esta ruta. Puedes
            intentar de nuevo sin recargar toda la aplicación.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-zinc-50 px-5 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Diagnóstico
          </p>
          <p className="mt-2 break-words text-sm text-zinc-400">
            {error.message || 'Sin mensaje de error disponible.'}
          </p>
        </div>
      </section>
    </main>
  )
}