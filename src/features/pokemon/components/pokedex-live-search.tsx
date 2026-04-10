"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";

type PokedexLiveSearchProps = {
  initialQuery: string;
};

const SEARCH_DEBOUNCE_MS = 300;

export function PokedexLiveSearch({ initialQuery }: PokedexLiveSearchProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    const isFocused = document.activeElement === input;

    if (!isFocused || initialQuery === "") {
      input.value = initialQuery;
    }
  }, [initialQuery]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleChange(term: string) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const normalizedTerm = term.trim();

      if (!normalizedTerm) {
        replace(pathname, { scroll: false });
        return;
      }

      const params = new URLSearchParams();
      params.set("query", normalizedTerm);
      params.set("page", "1");

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleClear() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    replace(pathname, { scroll: false });
  }

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="pokemon-search"
            className="text-sm font-medium text-zinc-200"
          >
            Buscar Pokémon por nombre
          </label>
          <p className="text-sm text-zinc-500">
            La búsqueda se actualiza automáticamente mientras escribes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            id="pokemon-search"
            type="text"
            defaultValue={initialQuery}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="Ej. pika, char, mime..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-500 focus:border-indigo-400/40 focus:bg-black/30"
          />

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-100 transition duration-200 hover:border-white/20 hover:bg-white/10"
          >
            Limpiar
          </button>
        </div>
      </div>
    </motion.section>
  );
}
