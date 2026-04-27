import { PokemonType } from "@/features/pokemon/utils/pokemon-colors";

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonStats = {
  stats: PokemonStat[];
  totalStats: number;
};

export type PokemonDescriptions = {
  text: string;
  version: string;
};

export type PokemonEvolutionChain = {
  name: string;
  stage: number;
  condition: string | null;
  imageUrl: string | null;
};

export type PokemonDetail = {
  id: number;
  isDefault: boolean;
  name: string;
  displayName: string;
  pokedexNumber: number;
  genus: string;
  descriptions: PokemonDescriptions[];
  imageUrl: string | null;
  imageUrlShiny: string | null;
  types: PokemonType[];
  heightMeters: number;
  weightKg: number;
  abilities: PokemonAbility[];
  statsBase: PokemonStats;
  statsMin: PokemonStats;
  statsMax: PokemonStats;
  evolutionChain: PokemonEvolutionChain[];
};

/**Pokemon Adjacent */
export type PokemonAdjacent = {
  id: number;
  name: string;
  displayName: string;
  pokedexNumber: number;
  imageUrl: string | null;
  types: PokemonType[];
};
