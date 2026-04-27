import { PokemonType } from "@/features/pokemon/utils/pokemon-colors";
import { PokemonFormType } from "@/features/pokemon/types/pokemon-api";

export type PokemonListItem = {
  id: number;
  name: string;
  displayName: string;
  pokedexNumber: number;
  forms: PokemonFormType[];
  imageUrl: string | null;
  types: PokemonType[];
};
