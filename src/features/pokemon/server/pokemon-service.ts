import {
  mapPokemonToDetail,
  mapPokemonToListItem,
} from "@/features/pokemon/server/pokemon-mappers";
import {
  PokeApiNotFoundError,
  pokeApiFetch,
} from "@/features/pokemon/server/pokemon-api";
import type { PokemonDetail } from "@/features/pokemon/types/pokemon-detail";
import type {
  PokemonListResponse,
  PokemonResponse,
} from "@/features/pokemon/types/pokemon-api";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

export const DEFAULT_PAGE_SIZE = 12;

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

function normalizePokemonName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

async function getPokemonResponseByName(
  name: string,
): Promise<PokemonResponse> {
  const normalizedName = normalizePokemonName(name);
  const safeName = encodeURIComponent(normalizedName);

  return pokeApiFetch<PokemonResponse>(`/pokemon/${safeName}`);
}

export async function getPokemonList(
  options: GetPokemonListOptions = {},
): Promise<PaginatedPokemonList> {
  const { limit = DEFAULT_PAGE_SIZE, offset = 0 } = options;

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
  const pokemonResponse = await getPokemonResponseByName(name);

  return mapPokemonToDetail(pokemonResponse);
}

export async function searchPokemonListItemByName(
  query: string,
): Promise<PokemonListItem | null> {
  try {
    const pokemonResponse = await getPokemonResponseByName(query);

    return mapPokemonToListItem(pokemonResponse);
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) {
      return null;
    }

    throw error;
  }
}
