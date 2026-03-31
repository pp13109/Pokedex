import type { PokemonDetail } from '@/features/pokemon/types/pokemon-detail'
import type { PokemonResponse } from '@/features/pokemon/types/pokemon-api'
import type { PokemonListItem } from '@/features/pokemon/types/pokemon-list-item'

function toTitleCase(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getPokemonImageUrl(pokemon: PokemonResponse) {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default
  )
}

function sortBySlot<T extends { slot: number }>(items: T[]) {
  return [...items].sort((a, b) => a.slot - b.slot)
}

export function mapPokemonToListItem(pokemon: PokemonResponse): PokemonListItem {
  return {
    id: pokemon.id,
    name: toTitleCase(pokemon.name),
    slug: pokemon.name,
    imageUrl: getPokemonImageUrl(pokemon),
    types: sortBySlot(pokemon.types).map((item) => toTitleCase(item.type.name)),
  }
}

export function mapPokemonToDetail(pokemon: PokemonResponse): PokemonDetail {
  return {
    id: pokemon.id,
    name: toTitleCase(pokemon.name),
    slug: pokemon.name,
    imageUrl: getPokemonImageUrl(pokemon),
    types: sortBySlot(pokemon.types).map((item) => toTitleCase(item.type.name)),
    heightMeters: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    abilities: [...pokemon.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map((item) => ({
        name: toTitleCase(item.ability.name),
        isHidden: item.is_hidden,
      })),
    stats: pokemon.stats.map((item) => ({
      name: toTitleCase(item.stat.name),
      value: item.base_stat,
    })),
  }
}