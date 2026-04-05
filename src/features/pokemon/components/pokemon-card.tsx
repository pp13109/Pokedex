import Image from "next/image";
import Link from "next/link";
import { PokemonTypeBadge } from "@/features/pokemon/components/pokemon-type-badge";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            #{pokemon.id.toString().padStart(4, "0")}
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            {pokemon.name}
          </h2>
        </div>

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-black/20">
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
        </div>
      </div>

      <div className="relative mb-6 flex flex-wrap gap-2">
        {pokemon.types.map((type) => (
          <PokemonTypeBadge key={type} type={type} />
        ))}
      </div>

      <Link
        href={`/pokemon/${pokemon.slug}`}
        className="relative inline-flex items-center rounded-full border border-white/10 bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-950 transition duration-200 hover:bg-white"
      >
        Ver detalle
      </Link>
    </article>
  );
}