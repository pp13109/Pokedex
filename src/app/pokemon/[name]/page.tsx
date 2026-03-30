import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pokemonMocks } from '@/features/pokemon/utils/pokemon-mocks'

type PokemonDetailPageProps = {
  params: Promise<{
    name: string
  }>
}

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { name } = await params

  const pokemon = pokemonMocks.find((item) => item.slug === name)

  if (!pokemon) {
    notFound()
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-400 transition hover:text-zinc-200"
        >
          ← Volver a la Pokédex
        </Link>
      </div>

      <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8">
        <p className="text-sm text-zinc-400">
          #{pokemon.id.toString().padStart(4, '0')}
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {pokemon.name}
        </h1>

        <ul className="mt-6 flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <li
              key={type}
              className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
            >
              {type}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-dashed border-zinc-800 p-6 text-zinc-400">
          Más adelante aquí mostraremos estadísticas, habilidades, sprites,
          evoluciones y más datos reales de la API.
        </div>
      </article>
    </main>
  )
}