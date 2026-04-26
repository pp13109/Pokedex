import Image from "next/image";
import Link from "next/link";
import type { PokemonEvolutionChain } from "@/features/pokemon/types/pokemon-detail";
import { toTitleCase } from "@/shared/utils/format";
import { FaArrowDownLong, FaArrowRightLong } from "react-icons/fa6";

type Props = {
  evolutionChain: PokemonEvolutionChain[];
  activePokemon: string;
};

export function PokemonEvolutionChainList({
  evolutionChain,
  activePokemon,
}: Props) {
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
    <div className="flex flex-col sm:flex-row items-center justify-evenly gap-4">
      {stageNumbers.map((stageNum, i) => (
        <>
          {i > 0 && (
            <>
              <p className="hidden sm:block text-zinc-500 text-lg">
                <FaArrowRightLong />
              </p>
              <p className="sm:hidden text-zinc-500 text-lg">
                <FaArrowDownLong />
              </p>
            </>
          )}
          <div key={stageNum} className="flex flex-row items-center gap-4">
            <ul className="flex flex-wrap sm:flex-col justify-center gap-2">
              {stages[stageNum].map((e) => (
                <li key={e.name}>
                  <Link
                    href={`/pokemon/${e.name}`}
                    className={`flex flex-col items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center transition hover:bg-white/10 max-w-50
                      ${activePokemon === e.name && "border-4 border-white/50"}`}
                  >
                    {e.imageUrl && (
                      <Image
                        src={e.imageUrl}
                        alt={toTitleCase(e.name)}
                        width={96}
                        height={96}
                        className="h-24 w-24 object-contain"
                        unoptimized
                      />
                    )}
                    <p className="text-sm font-medium">{toTitleCase(e.name)}</p>
                    {e.condition && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {e.condition}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ))}
    </div>
  );
}
