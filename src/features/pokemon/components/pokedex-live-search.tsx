"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

type PokedexLiveSearchProps = {
  initialQuery: string;
};

const SEARCH_DEBOUNCE_MS = 300;

export function PokedexLiveSearch({ initialQuery }: PokedexLiveSearchProps) {
  const searchParams = useSearchParams();
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

  function handleChange(query: string) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const normalizedTerm = query.trim();

      if (!normalizedTerm) {
        params.delete("query");
        params.delete("page");
      } else {
        params.set("query", normalizedTerm);
        params.set("page", "1");
      }

      const search = params.toString();

      replace(search ? `/?${search}` : "/", { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleClear() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    handleChange("");
  }

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-15 z-50 flex flex-row gap-3 items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      <CiSearch className="text-2xl text-zinc-300" />
      <input
        ref={inputRef}
        id="pokemon-search"
        type="text"
        defaultValue={initialQuery}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Buscar por nombre..."
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-500"
      />

      {initialQuery && (
        <motion.button
        id="search_clear_button"
        layout
        initial={{
          opacity: 0,
          y: 5
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          ease: "easeIn"
        }}
          type="button"
          onClick={handleClear}
          className="cursor-pointer text-zinc-300 hover:text-zinc-500 active:text-zinc-400"
        >
          <IoClose className="text-2xl" />
        </motion.button>
      )}
    </motion.section>
  );
}
