"use client";

import { motion } from "motion/react";
import type { PokemonStat } from "@/features/pokemon/types/pokemon-detail";

type PokemonStatsListProps = {
  stats: PokemonStat[];
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
    },
  },
};

export function PokemonStatsList({ stats }: PokemonStatsListProps) {
  const totalStats = stats.reduce((total, stat) => total + stat.value, 0);
  const maxStat = stats.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  ).value;
  
  const gradientBestStat = "bg-gradient-to-r from-sky-800 to-sky-500";
  const gradientTotal = "bg-gradient-to-r from-emerald-800 to-emerald-500";
  const gradientMax = "bg-gradient-to-r from-rose-800 to-rose-500";

  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {stats.map((stat) => (
        <motion.li
          key={stat.name}
          variants={itemVariants}
          className="space-y-1"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-300">{stat.name}</span>
            <span className="text-zinc-500">{stat.value}</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-zinc-800"
            aria-hidden="true"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stat.value / 255) * 100}%` }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${stat.value >= 255 ? gradientMax : stat.value === maxStat ? gradientBestStat : "bg-zinc-200"}`}
            />
          </div>
        </motion.li>
      ))}
      <motion.li key={totalStats} variants={itemVariants} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-300">Total</span>
          <span className="text-zinc-500">{totalStats}</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-zinc-800"
          aria-hidden="true"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalStats / 680) * 100}%` }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${totalStats >= 680 ? gradientMax : gradientTotal}`}
          />
        </div>
      </motion.li>
    </motion.ul>
  );
}
