import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

export const pokemonMocks: PokemonListItem[] = [
  {
    id: 1,
    name: "Bulbasaur",
    slug: "bulbasaur",
    types: ["Grass", "Poison"],
  },
  {
    id: 4,
    name: "Charmander",
    slug: "charmander",
    types: ["Fire"],
  },
  {
    id: 7,
    name: "Squirtle",
    slug: "squirtle",
    types: ["Water"],
  },
  {
    id: 25,
    name: "Pikachu",
    slug: "pikachu",
    types: ["Electric"],
  },
  {
    id: 16,
    name: "Pidgey",
    slug: "pidgey",
    types: ["Normal", "Flying"],
  },
];
