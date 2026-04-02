'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type PokedexLiveSearchProps = {
  initialQuery: string
}

const SEARCH_DEBOUNCE_MS = 100

export function PokedexLiveSearch({
  initialQuery,
}: PokedexLiveSearchProps) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const input = inputRef.current

    if (!input) {
      return
    }

    const isFocused = document.activeElement === input

    if (!isFocused || initialQuery === '') {
      input.value = initialQuery
    }
  }, [initialQuery])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleChange(term: string) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      const normalizedTerm = term.trim()

      if (!normalizedTerm) {
        replace(pathname, { scroll: false })
        return
      }

      const params = new URLSearchParams()
      params.set('query', normalizedTerm)
      params.set('page', '1')

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, SEARCH_DEBOUNCE_MS)
  }

  function handleClear() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    replace(pathname, { scroll: false })
  }

  return (
    <section className="space-y-3">
      <label htmlFor="pokemon-search" className="text-sm text-zinc-300">
        Buscar Pokémon por nombre
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id="pokemon-search"
          type="text"
          defaultValue={initialQuery}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Ej. pika, char, mime..."
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-zinc-600"
        />

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:border-zinc-700"
        >
          Limpiar
        </button>
      </div>

      <p className="text-sm text-zinc-500">
        La búsqueda se actualiza automáticamente mientras escribes.
      </p>
    </section>
  )
}