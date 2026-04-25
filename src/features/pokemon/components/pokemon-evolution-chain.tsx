import Link from "next/link";
import type { PokemonEvolutionChain } from "@/features/pokemon/types/pokemon-detail";
import { toTitleCase } from "@/shared/utils/format";

type Props = {
  evolutionChain: PokemonEvolutionChain[];
};

export function PokemonEvolutionChainList({ evolutionChain }: Props) {
  if (evolutionChain.length <= 1) return null;

  const stages = evolutionChain.reduce<Record<number, PokemonEvolutionChain[]>>(
    (acc, e) => {
      (acc[e.stage] ??= []).push(e);
      return acc;
    },
    {},
  );

  const stageNumbers = Object.keys(stages).map(Number).sort();

  return (
    <div className="flex flex-col items-center gap-4">
      {stageNumbers.map((stageNum, i) => (
        <div key={stageNum} className="flex flex-col items-center gap-4 w-full">
          {i > 0 && <p className="text-zinc-500 text-lg">↓</p>}
          <ul className="flex flex-wrap justify-center gap-2">
            {stages[stageNum].map((e) => (
              <li key={e.name}>
                <Link
                  href={`/pokemon/${e.name}`}
                  className="flex flex-col rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center transition hover:bg-white/10"
                >
                  <p className="text-sm font-medium">{toTitleCase(e.name)}</p>
                  {e.condition && (
                    <p className="mt-1 text-xs text-zinc-400">{e.condition}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
