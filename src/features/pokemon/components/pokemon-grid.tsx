import { PokemonCard } from '@/features/pokemon/components/pokemon-card'
import type { PokemonListItem } from '@/features/pokemon/types/pokemon-list-item'

type PokemonGridProps = {
  pokemon: PokemonListItem[]
  emptyMessage?: string
}

export function PokemonGrid({
  pokemon,
  emptyMessage = 'No encontramos Pokémon para mostrar.',
}: PokemonGridProps) {
  if (pokemon.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pokemon.map((item) => (
        <PokemonCard key={item.slug} pokemon={item} />
      ))}
    </div>
  )
}