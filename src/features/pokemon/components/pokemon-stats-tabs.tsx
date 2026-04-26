"use client";

import { useState } from "react";
import { PokemonStatsList } from "./pokemon-stats-list";
import { PokemonStats } from "../types/pokemon-detail";
import { motion } from "motion/react";

type PokemonStatsTabsProps = {
  statsBase: PokemonStats;
  statsMin: PokemonStats;
  statsMax: PokemonStats;
};

export default function PokemonStatsTabs({
  statsBase,
  statsMin,
  statsMax,
}: PokemonStatsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: "Base", stats: statsBase },
    { name: "Min", stats: statsMin },
    { name: "Max", stats: statsMax },
  ];

  const bestStatMax = statsMax.stats.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  ).value;

  const bestStatBase = statsBase.stats.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  ).value;

  const bestStatBaseName = statsBase.stats
    .filter((stat) => stat.value === bestStatBase)
    .map((stat) => stat.name);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Stats</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-0 justify-evenly border-b border-white/10">
          {tabs.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTab(i)}
              className={`relative cursor-pointer px-5 py-2 w-full text-sm font-medium ${activeTab === i ? "text-zinc-200" : "text-zinc-500"} transition duration-300`}
            >
              {t.name}
              {activeTab === i && (
                <motion.div
                  layoutId="tab-indicator"
                  transition={{
                    ease: "backOut",
                    duration: 0.3
                  }}
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-full bg-white/50`}
                />
              )}
            </button>
          ))}
        </div>
        <PokemonStatsList
          stats={tabs[activeTab].stats}
          statlimit={bestStatMax}
          statLimitTotal={statsMax.totalStats}
          bestStatBaseName={bestStatBaseName}
        />
      </div>
    </section>
  );
}
