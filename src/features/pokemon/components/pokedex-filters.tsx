"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

type FilterKey = "mega" | "gmax" | "regional";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "mega", label: "Mega" },
  { key: "gmax", label: "Gigamax" },
  { key: "regional", label: "Regionales" },
];

export function PokedexFilters() {
  const searchParams = useSearchParams();

  function buildToggleHref(key: FilterKey, isActive: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    if (isActive) {
      params.delete(key);
    } else {
      params.set(key, "true");
    }

    const search = params.toString();
    return search ? `/?${search}` : "/";
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("mega");
    params.delete("gmax");
    params.delete("regional");

    const search = params.toString();
    return search ? `/?${search}` : "/";
  }

  function getActiveFilterCount() {
    let activeFilter = 0
    if (searchParams.toString().includes("mega=")) activeFilter++;
    if(searchParams.toString().includes("gmax=")) activeFilter++;
    if(searchParams.toString().includes("regional=")) activeFilter++;

    return activeFilter;
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/4.5 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="space-y-3">
        <p className="text-sm text-zinc-500 uppercase tracking-wider">
          Filtrar por formas
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          {FILTER_OPTIONS.map(({ key, label }) => {
            const isActive = searchParams.get(key) === "true";
            return (
              <Link
                key={key}
                scroll={false}
                href={buildToggleHref(key, isActive)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "border-indigo-400/40 bg-indigo-400/20 text-indigo-200"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {getActiveFilterCount() > 0 && (
              <motion.div
                id="search_clear_button"
                layout
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeIn",
                }}
                className="cursor-pointer text-zinc-300 hover:text-zinc-500 active:text-zinc-400 uppercase"
              >
                <Link href={clearFilters()} scroll={false} className="text-xs flex items-center">
                  <MdFilterAlt className="text-xl"/>
                  ({getActiveFilterCount()})
                  Limpiar
                </Link>
              </motion.div>
            )}
        </div>
      </div>
    </section>
  );
}
