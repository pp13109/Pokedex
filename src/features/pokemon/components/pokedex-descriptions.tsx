"use client";

import { ReactNode, useState } from "react";
import { PokemonDetail } from "../types/pokemon-detail";
import { motion } from "motion/react";

type DescriptionProps = {
  pokemon: PokemonDetail;
};

export default function PokedexDescriptions({ pokemon }: DescriptionProps) {
  const [descriptionIndex, setDescriptionIndex] = useState(0);

  return (
    <section>
      <motion.div
        layout
        className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden"
      >
        <h1 className="text-lg text-center pt-3 tracking-tight font-semibold">
          {pokemon.genus}
        </h1>
        <div className="flex flex-row gap-3 overflow-x-auto p-4 border-b border-white/10">
          {pokemon.descriptions.map((description, index) => (
            <ButtonMotion
              key={description.version}
              options={{
                isSelected: descriptionIndex === index ? true : false,
              }}
              onClick={() => setDescriptionIndex(index)}
              className={`py-1 shrink-0`}
            >
              {description.version}
            </ButtonMotion>
          ))}
        </div>

        <motion.div
          layout
          className=" text-zinc-400 italic leading-relaxed p-3 pt-2"
        >
          "{pokemon.descriptions[descriptionIndex].text}"
        </motion.div>
      </motion.div>
    </section>
  );
}

type ButtonMotionProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  options?: {
    isSelected?: boolean;
    selectedClassName?: string;
    unselectedClassName?: string;
    disabled?: boolean;
    ariaLabel?: string;
    hoverScale?: number;
    tapScale?: number;
  };
};

const thumbnailButtonTransition = {
  type: "spring",
  stiffness: 420,
  damping: 24,
} as const;

function ButtonMotion({
  children,
  onClick,
  className,
  options = {},
}: ButtonMotionProps) {
  const {
    isSelected = false,
    selectedClassName = "border-white/40 bg-white/10",
    unselectedClassName = "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/10",
    disabled = false,
    ariaLabel,
    hoverScale = 1.1,
    tapScale = 0.95,
  } = options;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      disabled={disabled}
      whileHover={!disabled ? { scale: hoverScale } : undefined}
      whileTap={!disabled ? { scale: tapScale } : undefined}
      transition={thumbnailButtonTransition}
      className={`flex cursor-pointer items-center justify-center rounded-2xl border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50
        ${isSelected ? selectedClassName : unselectedClassName}
        ${className ?? ""}`}
    >
      {children}
    </motion.button>
  );
}
