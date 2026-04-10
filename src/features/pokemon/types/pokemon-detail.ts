export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonDetail = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  imageUrlShiny: string | null;
  types: string[];
  heightMeters: number;
  weightKg: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};
