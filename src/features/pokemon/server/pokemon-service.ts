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

export type SearchPokemonListResult = {
  totalMatches: number
  results: PokemonListItem[]
}

function normalizePokemonName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function comparePokemonNames(a: string, b: string, query: string) {
  const aStartsWithQuery = a.startsWith(query);
  const bStartsWithQuery = b.startsWith(query);

  if (aStartsWithQuery !== bStartsWithQuery) {
    return aStartsWithQuery ? -1 : 1;
  }

  const aMatchIndex = a.indexOf(query);
  const bMatchIndex = b.indexOf(query);

  if (aMatchIndex !== bMatchIndex) {
    return aMatchIndex - bMatchIndex;
  }

  return a.localeCompare(b);
}

async function getPokemonResponseByName(
  name: string,
): Promise<PokemonResponse> {
  const normalizedName = normalizePokemonName(name);
  const safeName = encodeURIComponent(normalizedName);

  return pokeApiFetch<PokemonResponse>(`/pokemon/${safeName}`);
}

async function getPokemonNameIndex(): Promise<string[]> {
  const metadataResponse = await pokeApiFetch<PokemonListResponse>(
    "/pokemon?limit=1&offset=0",
  );

  const fullListResponse = await pokeApiFetch<PokemonListResponse>(
    `/pokemon?limit=${metadataResponse.count}&offset=0`,
  );

  return fullListResponse.results.map(({ name }) => name);
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

export async function searchPokemonList(
  query: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<SearchPokemonListResult> {
  const normalizedQuery = normalizePokemonName(query)

  if (!normalizedQuery) {
    return {
      totalMatches: 0,
      results: [],
    }
  }

  const pokemonNames = await getPokemonNameIndex()

  const matchingNames = pokemonNames.filter((name) =>
    name.includes(normalizedQuery)
  )

  const offset = (page - 1) * pageSize
  const paginatedNames = matchingNames.slice(offset, offset + pageSize)

  const pokemonDetailPromises = paginatedNames.map((name) =>
    getPokemonResponseByName(name)
  )

  const pokemonResponses = await Promise.all(pokemonDetailPromises)

  return {
    totalMatches: matchingNames.length,
    results: pokemonResponses
      .map(mapPokemonToListItem)
      .sort((a, b) => a.id - b.id),
  }
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
