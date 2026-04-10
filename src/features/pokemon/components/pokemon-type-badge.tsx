type PokemonTypeBadgeProps = {
  type: string;
};

const typeStyles: Record<string, string> = {
  normal: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  fire: "border-orange-400/20 bg-orange-400/10 text-orange-200",
  water: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  electric: "border-yellow-400/20 bg-yellow-400/10 text-yellow-200",
  grass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  ice: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  fighting: "border-red-400/20 bg-red-400/10 text-red-200",
  poison: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
  ground: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  flying: "border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
  psychic: "border-pink-400/20 bg-pink-400/10 text-pink-200",
  bug: "border-lime-400/20 bg-lime-400/10 text-lime-200",
  rock: "border-stone-400/20 bg-stone-400/10 text-stone-200",
  ghost: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  dragon: "border-purple-400/20 bg-purple-400/10 text-purple-200",
  dark: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  steel: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  fairy: "border-rose-300/20 bg-rose-300/10 text-rose-100",
};

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const normalizedType = type.toLowerCase();
  const style =
    typeStyles[normalizedType] ?? "border-white/10 bg-white/5 text-zinc-200";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${style}`}
    >
      {type}
    </span>
  );
}
