export type PokemonType =
  | "Grass"
  | "Poison"
  | "Fire"
  | "Water"
  | "Electric"
  | "Flying"
  | "Normal"

export type PokemonListItem = {
  id: number;
  name: string;
  slug: string;
  types: PokemonType[];
};
