"use client";

import { useMemo, useState } from "react";
import { PokemonCard } from "@/features/pokemon/components/pokemon-card";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

type PokedexClientProps = {
  initialPokemon: PokemonListItem[];
};

export function PokedexClient({ initialPokemon }: PokedexClientProps) {
  const [query, setQuery] = useState("");

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return initialPokemon;
    }

    return initialPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedQuery),
    );
  }, [initialPokemon, query]);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <label htmlFor="pokemon-search" className="text-sm text-zinc-300">
          Buscar Pokémon
        </label>

        <input
          id="pokemon-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. Pikachu"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-zinc-600"
        />

        <p className="text-sm text-zinc-400">
          Mostrando {filteredPokemon.length} resultado(s).
        </p>
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
          No encontramos Pokémon que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.slug} pokemon={pokemon} />
          ))}
        </div>
      )}
    </section>
  );
}
