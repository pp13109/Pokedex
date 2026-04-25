import {
  mapPokemonToDetail,
  mapPokemonToListItem,
} from "@/features/pokemon/server/pokemon-mappers";
import { pokeApiFetch } from "@/features/pokemon/server/pokemon-api";
import type { PokemonDetail } from "@/features/pokemon/types/pokemon-detail";
import type {
  EvolutionChainResponse,
  EvolutionChainEvolvesToResponse,
  PokemonFormResponse,
  PokemonListResponse,
  PokemonNameResponse,
  PokemonResponse,
  PokemonSpeciesResponse,
  PokemonVariety,
} from "@/features/pokemon/types/pokemon-api";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";
import { unstable_cache } from "next/cache";
import {
  classifyVariety,
  filterPokemonVarieties,
} from "@/features/pokemon/utils/pokemon-form";
import { normalizePokemonName } from "@/features/pokemon/utils/format";
import {
  calculateCurrentPage,
  calculateOffset,
  calculateTotalPages,
} from "@/features/pokemon/utils/pagination";
import { toTitleCase } from "@/shared/utils/format";
import {
  DEFAULT_HOME_PAGE_SIZE,
  DISPLAY_NAME_LANGUAGE,
  Language,
} from "@/shared/constants/preferences";

type GetPokemonListOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
  filters?: {
    filterMega?: boolean;
    filterGmax?: boolean;
    filterRegional?: boolean;
    filterAltered?: boolean;
  };
};

type PokemonListResult = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  fullListItems: number;
  results: PokemonListItem[];
};

/**Export */
export async function getPokemonDetail(name: string): Promise<PokemonDetail> {
  const pokemon = await getPokemonByName(name);
  const pokemonSpecies = await getPokemonSpeciesByName(pokemon.species.name);

  const displayName = pokemon.is_default
    ? getDisplayName(pokemonSpecies.names, pokemon.name, DISPLAY_NAME_LANGUAGE)
    : getDisplayName(
        (await getPokemonFormByName(pokemon.name)).names,
        pokemon.name,
        DISPLAY_NAME_LANGUAGE,
      );

  const evolutionChain = await getEvolutionChain(pokemonSpecies.evolution_chain.url);

  const chainSpeciesNames = collectChainSpeciesNames(evolutionChain.chain);
  const chainSpeciesArr = await Promise.all(
    chainSpeciesNames.map((n) => getPokemonSpeciesByName(n)),
  );
  const chainSpeciesVarieties = new Map<string, string[]>();
  for (let i = 0; i < chainSpeciesNames.length; i++) {
    chainSpeciesVarieties.set(
      chainSpeciesNames[i],
      chainSpeciesArr[i].varieties
        .filter((v) => !v.is_default && classifyVariety(v.pokemon.name, false).includes("regional"))
        .map((v) => v.pokemon.name),
    );
  }

  return mapPokemonToDetail(pokemon, pokemonSpecies, displayName, evolutionChain, chainSpeciesVarieties);
}

function collectChainSpeciesNames(node: EvolutionChainEvolvesToResponse): string[] {
  return [node.species.name, ...node.evolves_to.flatMap(collectChainSpeciesNames)];
}

export async function getPokemonList(
  options: GetPokemonListOptions = {},
): Promise<PokemonListResult> {
  const {
    query = "",
    page = 1,
    pageSize = DEFAULT_HOME_PAGE_SIZE,
    filters: {
      filterMega = false,
      filterGmax = false,
      filterRegional = false,
      filterAltered = true,
    } = {},
  } = options;

  const allVarietiesList = await getAllPokemonVarieties();

  let filteredList = filterPokemonVarieties(
    { filterMega, filterGmax, filterRegional, filterAltered },
    allVarietiesList,
  );

  const fullListItems = filteredList.length;

  if (query) {
    filteredList = filterSearchByName(query, filteredList);
  }

  const totalItems = filteredList.length;

  const currentPage = calculateCurrentPage(page, totalItems, pageSize);
  const offset = calculateOffset(currentPage, pageSize);

  const paginatedList = filteredList.slice(offset, offset + pageSize);

  const paginatedListPromises = paginatedList.map(async (v) => {
    const pokemon = await pokeApiFetch<PokemonResponse>(v.url, true);

    return { pokemon, pokemonVariety: v };
  });

  const paginatedListResults = await Promise.all(paginatedListPromises);

  return {
    totalItems,
    totalPages: calculateTotalPages(totalItems, pageSize),
    currentPage: currentPage,
    fullListItems,
    results: paginatedListResults.map(({ pokemon, pokemonVariety }) =>
      mapPokemonToListItem(pokemon, pokemonVariety),
    ),
  };
}

/**Main */
const getAllPokemonVarieties = unstable_cache(
  async (): Promise<PokemonVariety[]> => {
    const count = await getPokemonSpeciesCount();
    const allSpeciesList = await pokeApiFetch<PokemonListResponse>(
      `/pokemon-species?limit=${count}`,
    );

    const GROUP_SIZE = 50;
    const allSpeciesResults: PokemonSpeciesResponse[] = [];

    for (let i = 0; i < allSpeciesList.results.length; i += GROUP_SIZE) {
      const group = allSpeciesList.results.slice(i, i + GROUP_SIZE);
      const groupResults = await Promise.all(
        group.map((s) => pokeApiFetch<PokemonSpeciesResponse>(s.url, true)),
      );
      allSpeciesResults.push(...groupResults);
    }

    const allVarieties = allSpeciesResults.flatMap((s) =>
      s.varieties.map((v) => ({ species: s, variety: v })),
    );

    const allVarietiesResults: PokemonVariety[] = [];
    for (let i = 0; i < allVarieties.length; i += GROUP_SIZE) {
      const group = allVarieties.slice(i, i + GROUP_SIZE);

      const groupResults = await Promise.all(
        group.map(async ({ species: s, variety: v }) => {
          const displayName = v.is_default
            ? getDisplayName(s.names, v.pokemon.name, DISPLAY_NAME_LANGUAGE)
            : getDisplayName(
                (await getPokemonFormByName(v.pokemon.name)).names,
                v.pokemon.name,
                DISPLAY_NAME_LANGUAGE,
              );

          return {
            speciesId: s.id,
            url: v.pokemon.url,
            name: v.pokemon.name,
            displayName,
            pokedexNumbers: s.pokedex_numbers,
            isDefault: v.is_default,
            formType: classifyVariety(v.pokemon.name, v.is_default),
          };
        }),
      );

      allVarietiesResults.push(...groupResults);
    }

    return allVarietiesResults;
  },
  ["pokemon-variety-index"],
  { revalidate: 60 * 60 * 24 },
);

const getPokemonSpeciesCount = unstable_cache(
  async () => {
    const response = await pokeApiFetch<PokemonListResponse>(
      "/pokemon-species?limit=1&offset=0",
    );
    return response.count;
  },
  ["pokemon-species-count"],
  { revalidate: 60 * 60 * 24 },
);

/**General */
async function getPokemonByName(name: string): Promise<PokemonResponse> {
  const normalizedName = normalizePokemonName(name);
  const safeName = encodeURIComponent(normalizedName);

  return pokeApiFetch<PokemonResponse>(`/pokemon/${safeName}`);
}

async function getPokemonSpeciesByName(
  name: string,
): Promise<PokemonSpeciesResponse> {
  const normalizedName = normalizePokemonName(name);
  const safeName = encodeURIComponent(normalizedName);

  return pokeApiFetch<PokemonSpeciesResponse>(`/pokemon-species/${safeName}`);
}

async function getPokemonFormByName(
  name: string,
): Promise<PokemonFormResponse> {
  const normalizedName = normalizePokemonName(name);
  const safeName = encodeURIComponent(normalizedName);

  return pokeApiFetch<PokemonFormResponse>(`/pokemon-form/${safeName}`);
}

async function getEvolutionChain(
  url: string,
): Promise<EvolutionChainResponse> {
  return pokeApiFetch<EvolutionChainResponse>(url, true);
}

/**Utils */
function filterSearchByName(query: string, list: PokemonVariety[]) {
  const strip = (str: string) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  return list.filter((v) => strip(v.displayName).includes(strip(query)));
}

function getDisplayName(
  displayNames: PokemonNameResponse[],
  defaultName: string,
  language: Language,
): string {
  const displayName =
    displayNames.find((entry) => entry.language.name === language)?.name ??
    toTitleCase(defaultName);

  return language === "es"
    ? displayName.replace("Gmax", "Gigamax")
    : displayName;
}
