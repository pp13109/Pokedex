import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PokeApiNotFoundError,
} from '@/features/pokemon/server/pokemon-api'
import { getPokemonByName } from '@/features/pokemon/server/pokemon-service'

type PokemonDetailPageProps = {
  params: Promise<{
    name: string
  }>
}

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { name } = await params

  try {
    const pokemon = await getPokemonByName(name)

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            ← Volver a la Pokédex
          </Link>
        </div>

        <article className="grid gap-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="relative mx-auto h-64 w-64">
              {pokemon.imageUrl ? (
                <Image
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <p className="text-sm text-zinc-400">
                #{pokemon.id.toString().padStart(4, '0')}
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {pokemon.name}
              </h1>

              <ul className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <li
                    key={type}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                <p className="text-sm text-zinc-500">Altura</p>
                <p className="mt-2 text-2xl font-semibold">
                  {pokemon.heightMeters} m
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                <p className="text-sm text-zinc-500">Peso</p>
                <p className="mt-2 text-2xl font-semibold">
                  {pokemon.weightKg} kg
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Habilidades
              </h2>

              <ul className="grid gap-3 sm:grid-cols-2">
                {pokemon.abilities.map((ability) => (
                  <li
                    key={`${ability.name}-${ability.isHidden ? 'hidden' : 'normal'}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <p className="font-medium">{ability.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {ability.isHidden ? 'Habilidad oculta' : 'Habilidad normal'}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Stats base
              </h2>

              <ul className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <li key={stat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{stat.name}</span>
                      <span className="text-zinc-500">{stat.value}</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-zinc-200"
                        style={{ width: `${Math.min(stat.value, 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>
    )
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) {
      notFound()
    }

    throw error
  }
}