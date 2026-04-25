export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonDescriptions = {
  text: string;
  version: string;
};

export type PokemonEvolutionChain = {
  name: string;
  stage: number;
  condition: string | null;
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
  types: string[];
  heightMeters: number;
  weightKg: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  evolutionChain: PokemonEvolutionChain[];
};
