"use client";

import { AnimatePresence, motion } from "motion/react";
import { PokemonCard } from "@/features/pokemon/components/pokemon-card";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

type PokemonGridProps = {
  pokemon: PokemonListItem[];
  emptyMessage?: string;
};

const emptyStateVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.18,
    },
  },
};

export function PokemonGrid({
  pokemon,
  emptyMessage = "No encontramos Pokémon para mostrar.",
}: PokemonGridProps) {
  return (
    <AnimatePresence>
      {pokemon.length === 0 ? (
        <motion.div
          key="empty-state"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400"
          role="status"
          aria-live="polite"
        >
          {emptyMessage}
        </motion.div>
      ) : (
        <div
          key="results-grid"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-label="Resultados de Pokémon"
        >
          {pokemon.map((item, index) => (
            <PokemonCard key={item.slug} pokemon={item} index={index} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
