import type {
  PokemonAdjacent,
  PokemonDescriptions,
  PokemonDetail,
  PokemonEvolutionChain,
  PokemonStats,
} from "@/features/pokemon/types/pokemon-detail";
import type {
  PokemonSpeciesFlavorTextEntriesResponse,
  PokemonSpeciesGeneraResponse,
  PokemonSpeciesPokedexNumberResponse,
  PokemonResponse,
  PokemonSpeciesResponse,
  PokemonVariety,
  PokemonManualDescriptionEntries,
  PokemonStatsResponse,
} from "@/features/pokemon/types/pokemon-api";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";
import { toTitleCase } from "@/shared/utils/format";
import regionalDescriptionsRaw from "@/features/pokemon/data/regional-descriptions.json";
import altFormDescriptionsRaw from "@/features/pokemon/data/alt-form-descriptions.json";
import { Language, SYSTEM_LANGUAGE } from "@/shared/constants/preferences";
import { PokemonType } from "@/features/pokemon/utils/pokemon-colors";

/**Export */
export function mapPokemonToListItem(
  pokemon: PokemonResponse,
  pokemonVariety: PokemonVariety,
): PokemonListItem {
  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName: pokemonVariety.displayName,
    pokedexNumber:
      getPokedexNumber(pokemonVariety.pokedexNumbers) ??
      pokemonVariety.speciesId,
    forms: pokemonVariety.formType,
    imageUrl: getPokemonImageUrl(pokemon, false),
    types: sortBySlot(pokemon.types).map(
      (item) => toTitleCase(item.type.name) as PokemonType,
    ),
  };
}

export function mapPokemonToDetail(
  pokemon: PokemonResponse,
  pokemonSpecies: PokemonSpeciesResponse,
  displayName: string,
  evolutionChain: PokemonEvolutionChain[],
): PokemonDetail {
  return {
    id: pokemon.id,
    isDefault: pokemon.is_default,
    name: pokemon.name,
    displayName: displayName,
    pokedexNumber:
      getPokedexNumber(pokemonSpecies.pokedex_numbers) ?? pokemonSpecies.id,
    genus: getGenera(pokemonSpecies.genera, SYSTEM_LANGUAGE, pokemon.name),
    descriptions: getDescriptions(
      pokemonSpecies.flavor_text_entries,
      SYSTEM_LANGUAGE,
      pokemon.name,
    ),
    imageUrl: getPokemonImageUrl(pokemon, false),
    imageUrlShiny: getPokemonImageUrl(pokemon, true),
    types: sortBySlot(pokemon.types).map(
      (item) => toTitleCase(item.type.name) as PokemonType,
    ),
    heightMeters: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    abilities: [...pokemon.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map((item) => ({
        name: toTitleCase(item.ability.name),
        isHidden: item.is_hidden,
      })),
    statsBase: {
      stats: pokemon.stats.map((item) => ({
        name: toTitleCase(item.stat.name),
        value: item.base_stat,
      })),
      totalStats: pokemon.stats.reduce(
        (total, stat) => total + stat.base_stat,
        0,
      ),
    },
    statsMin: getCalculatedMinMaxStats(pokemon.stats, false),
    statsMax: getCalculatedMinMaxStats(pokemon.stats, true),
    evolutionChain,
  };
}

export function mapPokemonToAdjacent(
  pokemon: PokemonResponse,
  pokemonSpecies: PokemonSpeciesResponse,
  displayName: string,
): PokemonAdjacent {
  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName: displayName,
    pokedexNumber:
      getPokedexNumber(pokemonSpecies.pokedex_numbers) ?? pokemonSpecies.id,
    imageUrl: getPokemonImageUrl(pokemon, false),
    types: sortBySlot(pokemon.types).map(
      (item) => toTitleCase(item.type.name) as PokemonType,
    ),
  };
}

/**Utils */
function getCalculatedMinMaxStats(
  stats: PokemonStatsResponse[],
  max: boolean,
): PokemonStats {
  const iv = max ? 31 : 0;
  const ev = max ? 252 : 0;
  const nature = max ? 1.1 : 0.9;

  const level = 100;

  const calculatedStats = stats.map((s) => {
    if (s.stat.name === "hp") {
      return {
        name: toTitleCase(s.stat.name),
        value: Math.floor(
          ((2 * s.base_stat + iv + ev / 4) * level) / 100 + level + 10,
        ),
      };
    } else {
      return {
        name: toTitleCase(s.stat.name),
        value: Math.floor(
          (((2 * s.base_stat + iv + ev / 4) * level) / 100 + 5) * nature,
        ),
      };
    }
  });

  const totalStats = calculatedStats.reduce(
    (total, stat) => total + stat.value,
    0,
  );

  return { stats: calculatedStats, totalStats: totalStats };
}

function getDescriptions(
  flavor_text_entries: PokemonSpeciesFlavorTextEntriesResponse[],
  language: Language,
  name: string,
): PokemonDescriptions[] {
  const regionalDescriptions = getRegionalDescriptions(name, language);
  if (regionalDescriptions.length > 0) {
    return regionalDescriptions.map((description) => ({
      text: description.text,
      version: toTitleCase(description.version),
    }));
  }

  const altFormDescriptions = getAltFormDescriptions(name, language);
  if (altFormDescriptions.length > 0) {
    return altFormDescriptions.map((description) => ({
      text: description.text,
      version: toTitleCase(description.version),
    }));
  }

  const descriptions = flavor_text_entries.filter(
    (entry) => entry.language.name === language,
  );

  let descriptionsAlt = [];
  let descriptionsObj = [];
  if (language !== "en" && descriptions.length === 0) {
    descriptionsAlt = flavor_text_entries.filter(
      (entry) => entry.language.name === "en",
    );

    descriptionsObj = descriptionsAlt
      .map((description) => ({
        text: description.flavor_text,
        version: toTitleCase(description.version.name),
      }))
      .toReversed();
  } else {
    descriptionsObj = descriptions
      .map((description) => ({
        text: description.flavor_text,
        version: toTitleCase(description.version.name),
      }))
      .toReversed();
  }

  return descriptionsObj.length > 0
    ? descriptionsObj
    : [
        {
          text: `Sin escripciones en "${language}"`,
          version: `Sin versiones en "${language}"`,
        },
      ];
}

function getRegionalDescriptions(
  name: string,
  language: Language,
): PokemonDescriptions[] {
  const regionalDescriptions = regionalDescriptionsRaw as Record<
    string,
    Record<string, PokemonManualDescriptionEntries>
  >;
  return regionalDescriptions[name]?.[language].entries.toReversed() ?? [];
}

function getAltFormDescriptions(
  name: string,
  language: Language,
): PokemonDescriptions[] {
  const altformDescriptions = altFormDescriptionsRaw as Record<
    string,
    Record<string, PokemonManualDescriptionEntries>
  >;
  return altformDescriptions[name]?.[language].entries.toReversed() ?? [];
}

function getGenera(
  genera: PokemonSpeciesGeneraResponse[],
  language: Language,
  name: string,
): string {
  const manualGenera = getRegionalGenera(name, language);
  if (manualGenera !== "") {
    return manualGenera;
  }

  const generaObj = genera.find((entry) => entry.language.name === language);

  let generaObjAlt = undefined;
  if (language !== "en" && !generaObj) {
    generaObjAlt = genera.find((entry) => entry.language.name === "en");
  }

  return generaObj
    ? generaObj.genus
    : generaObjAlt
      ? generaObjAlt.genus
      : `Sin genero en "${language}"`;
}

function getRegionalGenera(name: string, language: Language): string {
  const regionalDescriptions = regionalDescriptionsRaw as Record<
    string,
    Record<string, PokemonManualDescriptionEntries>
  >;
  return regionalDescriptions[name]?.[language].genus ?? "";
}

function getPokemonImageUrl(pokemon: PokemonResponse, shiny: boolean) {
  if (!shiny) {
    return (
      pokemon.sprites.other?.["home"]?.front_default ??
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.front_default
    );
  } else {
    return (
      pokemon.sprites.other?.["home"]?.front_shiny ??
      pokemon.sprites.other?.["official-artwork"]?.front_shiny ??
      pokemon.sprites.front_shiny
    );
  }
}

function getPokedexNumber(
  pokedexNumbers: PokemonSpeciesPokedexNumberResponse[],
) {
  return pokedexNumbers.find((number) => number.pokedex.name === "national")
    ?.entry_number;
}

function sortBySlot<T extends { slot: number }>(items: T[]) {
  return [...items].sort((a, b) => a.slot - b.slot);
}
