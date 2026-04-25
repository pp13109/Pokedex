"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { BsStars } from "react-icons/bs";

type PokemonImagesMobileProps = {
  name: string;
  imageUrl: string | null;
  imageUrlShiny: string | null;
};

const currentImageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.8,
} as const;

const thumbnailButtonTransition = {
  type: "spring",
  stiffness: 420,
  damping: 24,
} as const;

export function PokemonDetailImages({
  name,
  imageUrl,
  imageUrlShiny,
}: PokemonImagesMobileProps) {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const isImageBase = currentImage === imageUrl;

  return (
    <section className="flex flex-col gap-6">
      <div className="relative rounded-[28px] border border-white/10 bg-black/20 p-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isImageBase ? "normal" : "shiny"}
            initial={{
              y: 228,
              x: isImageBase ? -63 : 63,
              scale: 0.27,
            }}
            animate={{
              y: 0,
              x: 0,
              scale: 1,
            }}
            exit={{
              y: 228,
              x: isImageBase ? -63 : 63,
              scale: 0.27,
              transition: {
                duration: 0.25,
                ease: "easeOut",
              },
            }}
            transition={currentImageTransition}
            className="relative h-64 w-64 z-10"
          >
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`${name} ${isImageBase ? "" : "shiny"}`}
                fill
                sizes="256px"
                className="object-contain"
              />
            ) : null}
          </motion.div>
          {!isImageBase ? (
            <motion.div
              key="shiny-stars"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="absolute top-5 right-5"
            >
              <BsStars className="text-yellow-400 text-2xl" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-6">
        <motion.button
          type="button"
          onClick={() => setCurrentImage(imageUrl)}
          aria-label={`Ver imagen normal de ${name}`}
          aria-pressed={isImageBase}
          disabled={!imageUrl}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={thumbnailButtonTransition}
          className={`flex cursor-pointer items-center justify-center rounded-2xl border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50 ${
            isImageBase
              ? "border-white/40 bg-white/10"
              : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/10"
          }`}
        >
          <div className="relative h-17 w-17">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="256px"
                className="object-contain"
              />
            ) : null}
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setCurrentImage(imageUrlShiny)}
          aria-label={`Ver imagen shiny de ${name}`}
          aria-pressed={!isImageBase}
          disabled={!imageUrlShiny}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={thumbnailButtonTransition}
          className={`relative flex cursor-pointer items-center justify-center rounded-2xl border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 disabled:cursor-not-allowed disabled:opacity-50 ${
            !isImageBase
              ? "border-yellow-400/40 bg-yellow-400/10"
              : "border-white/10 bg-black/20 hover:border-yellow-400/30 hover:bg-yellow-400/10"
          }`}
        >
          <div className="relative h-17 w-17">
            {imageUrlShiny ? (
              <Image
                src={imageUrlShiny}
                alt={`${name} shiny`}
                fill
                sizes="256px"
                className="object-contain"
              />
            ) : null}
          </div>
          <div className="absolute top-2 right-2">
            <BsStars className="text-yellow-400 text-sm" />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
