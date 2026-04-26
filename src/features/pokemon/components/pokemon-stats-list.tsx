"use client";

import { motion } from "motion/react";
import type { PokemonStats } from "@/features/pokemon/types/pokemon-detail";

type PokemonStatsListProps = {
  stats: PokemonStats;
  statlimit: number;
  statLimitTotal: number;
  bestStatBaseName: string[];
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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
      duration: 0.25,
    },
  },
};

export function PokemonStatsList({ stats, statlimit, statLimitTotal, bestStatBaseName }: PokemonStatsListProps) {
  const gradientBestStat = "bg-gradient-to-r from-sky-800 to-sky-500";
  const gradientTotal = "bg-gradient-to-r from-emerald-800 to-emerald-500";
  const gradientNormal = "bg-gradient-to-r from-zinc-500 to-zinc-200";

  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {stats.stats.map((stat) => (
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
              animate={{
                width: `${Math.min((stat.value / statlimit) * 100, 100)}%`,
              }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}
              className={`h-full rounded-full ${bestStatBaseName.includes(stat.name) ? gradientBestStat : gradientNormal}`}
            />
          </div>
        </motion.li>
      ))}

      <motion.li
        key="totalStats"
        variants={itemVariants}
        className="space-y-1"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-300">Total</span>
          <span className="text-zinc-500">{stats.totalStats}</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-zinc-800"
          aria-hidden="true"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((stats.totalStats / statLimitTotal) * 100, 100)}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "backOut",
            }}
            className={`h-full rounded-full ${gradientTotal}`}
          />
        </div>
      </motion.li>
    </motion.ul>
  );
}
