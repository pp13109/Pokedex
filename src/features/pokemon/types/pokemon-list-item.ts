import { PokemonFormType } from "./pokemon-api";

export type PokemonListItem = {
  id: number;
  name: string;
  displayName: string;
  pokedexNumber: number;
  forms: PokemonFormType[];
  imageUrl: string | null;
  types: string[];
};
