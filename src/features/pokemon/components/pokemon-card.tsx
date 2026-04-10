"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { PokemonTypeBadge } from "@/features/pokemon/components/pokemon-type-badge";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";
import { typeColors } from "@/features/pokemon/constants/pokemon-colors";

type PokemonCardProps = {
  pokemon: PokemonListItem;
  index?: number;
};

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const primaryType = pokemon.types[0].toLowerCase();
  const secondaryType = pokemon.types[1]?.toLowerCase() ?? primaryType;
  const typeColor = typeColors[primaryType];
  const typeColor2 = typeColors[secondaryType];

  const bgGradient = `bg-radial-[at_100%_100%] from-(--type-color2) via-(--type-color1) to-white/[0.045] from-0% via-40% to-80%`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.28,
        delay: Math.min(index * 0.1, 1.1),
      }}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.18 },
      }}
      whileTap={{ scale: 0.995 }}
      style={
        {
          "--type-color1": typeColor,
          "--type-color2": typeColor2,
        } as React.CSSProperties
      }
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 ${bgGradient} p-0 shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl`}
      role="listitem"
    >
      <Link href={`/pokemon/${pokemon.slug}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="relative p-5 pb-1.25 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              #{pokemon.id.toString().padStart(4, "0")}
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {pokemon.name}
            </h2>
          </div>

          <motion.div
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-black/20"
            whileHover={{ rotate: -3, scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            {pokemon.imageUrl ? (
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.name}
                fill
                sizes="96px"
                className="object-contain p-2 transition duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-300">
                {pokemon.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </motion.div>
        </div>

        <div className="relative flex flex-wrap gap-2 p-5 pt-1.25">
          {pokemon.types.map((type) => (
            <PokemonTypeBadge key={type} type={type} />
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
