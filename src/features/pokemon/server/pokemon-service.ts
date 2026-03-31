import {
  mapPokemonToDetail,
  mapPokemonToListItem,
} from "@/features/pokemon/server/pokemon-mappers";
import { pokeApiFetch } from "@/features/pokemon/server/pokemon-api";
import type { PokemonDetail } from "@/features/pokemon/types/pokemon-detail";
import type {
  PokemonListResponse,
  PokemonResponse,
} from "@/features/pokemon/types/pokemon-api";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

export type PaginatedPokemonList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

type GetPokemonListOptions = {
  limit?: number;
  offset?: number;
};

export async function getPokemonList(
  options: GetPokemonListOptions = {},
): Promise<PaginatedPokemonList> {
  const { limit = 12, offset = 0 } = options;

  const listResponse = await pokeApiFetch<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
  );

  const pokemonDetailPromises = listResponse.results.map(({ name }) =>
    pokeApiFetch<PokemonResponse>(`/pokemon/${name}`),
  );

  const pokemonResponses = await Promise.all(pokemonDetailPromises);

  return {
    count: listResponse.count,
    next: listResponse.next,
    previous: listResponse.previous,
    results: pokemonResponses.map(mapPokemonToListItem),
  };
}

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  const normalizedName = name.trim().toLowerCase();
  const safeName = encodeURIComponent(normalizedName);

  const pokemonResponse = await pokeApiFetch<PokemonResponse>(
    `/pokemon/${safeName}`,
  );

  return mapPokemonToDetail(pokemonResponse);
}
