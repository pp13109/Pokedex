import Link from "next/link";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">
            #{pokemon.id.toString().padStart(4, "0")}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {pokemon.name}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-sm font-bold text-zinc-300">
          {pokemon.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <ul className="mb-5 flex flex-wrap gap-2">
        {pokemon.types.map((type) => (
          <li
            key={type}
            className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300"
          >
            {type}
          </li>
        ))}
      </ul>

      <Link
        href={`/pokemon/${pokemon.slug}`}
        className="inline-flex rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
      >
        Ver detalle
      </Link>
    </article>
  );
}
