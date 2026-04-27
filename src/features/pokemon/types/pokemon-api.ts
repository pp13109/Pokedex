export type NamedApiResource = {
  name: string;
  url: string;
};

export type PokemonNameResponse = {
  name: string;
  language: NamedApiResource;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

export type PokemonFormType =
  | "default"
  | "mega"
  | "gmax"
  | "regional"
  | "altered"
  | "other";

export type PokemonVariety = {
  speciesId: number;
  url: string;
  name: string;
  displayName: string;
  pokedexNumbers: PokemonSpeciesPokedexNumberResponse[];
  isDefault: boolean;
  formType: PokemonFormType[];
};

/**Pokemon */
export type PokemonStatsResponse = {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
};

export type PokemonResponse = {
  id: number;
  name: string;
  species: NamedApiResource;
  is_default: boolean;
  height: number;
  weight: number;
  abilities: Array<{
    is_hidden: boolean;
    slot: number;
    ability: NamedApiResource;
  }>;
  stats: PokemonStatsResponse[];
  types: Array<{
    slot: number;
    type: NamedApiResource;
  }>;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      home?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      dream_world?: {
        front_default: string | null;
      };
    };
  };
};

/**Pokemon-species */
export type PokemonSpeciesFlavorTextEntriesResponse = {
  flavor_text: string;
  language: NamedApiResource;
  version: NamedApiResource;
};

export type PokemonManualDescriptionEntries = {
  genus: string;
  entries: Array<{
    text: string;
    version: string;
  }>;
};

export type PokemonSpeciesGeneraResponse = {
  genus: string;
  language: NamedApiResource;
};

export type PokemonSpeciesPokedexNumberResponse = {
  entry_number: number;
  pokedex: NamedApiResource;
};

export type PokemonSpeciesResponse = {
  id: number;
  names: PokemonNameResponse[];
  pokedex_numbers: PokemonSpeciesPokedexNumberResponse[];
  flavor_text_entries: PokemonSpeciesFlavorTextEntriesResponse[];
  genera: PokemonSpeciesGeneraResponse[];
  evolution_chain: {
    url: string;
  };
  varieties: Array<{
    is_default: boolean;
    pokemon: NamedApiResource;
  }>;
};

/**Pokemon-form */
export type PokemonFormResponse = {
  names: PokemonNameResponse[];
};

/**Evolutioon Chain */
export type EvolutionChainDetailsResponse = {
  trigger: NamedApiResource;
  base_form: NamedApiResource | null;
  gender: number | null;
  held_item: NamedApiResource | null;
  item: NamedApiResource | null;
  known_move: NamedApiResource | null;
  known_move_type: NamedApiResource | null;
  location: NamedApiResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_damage_taken: number | null;
  min_happiness: number | null;
  min_level: number | null;
  min_move_count: number | null;
  min_steps: number | null;
  needs_multiplayer: boolean;
  needs_overworld_rain: boolean;
  party_species: NamedApiResource | null;
  party_type: NamedApiResource | null;
  region: NamedApiResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedApiResource | null;
  turn_upside_down: boolean;
  used_move: NamedApiResource | null;
};

export type EvolutionChainEvolvesToResponse = {
  evolution_details: EvolutionChainDetailsResponse[];
  evolves_to: EvolutionChainEvolvesToResponse[];
  species: NamedApiResource;
};

export type EvolutionChainResponse = {
  id: number;
  chain: EvolutionChainEvolvesToResponse;
};
