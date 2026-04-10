export type NamedApiResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

export type PokemonResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: Array<{
    is_hidden: boolean;
    slot: number;
    ability: NamedApiResource;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: NamedApiResource;
  }>;
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
