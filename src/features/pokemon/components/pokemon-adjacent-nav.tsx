import { notFound } from "next/navigation";
import { PokeApiNotFoundError } from "@/features/pokemon/server/pokemon-api";
import { getPokemonAdjacent } from "@/features/pokemon/server/pokemon-service";
import { PokemonTypeBadge } from "@/features/pokemon/components/pokemon-type-badge";
import Image from "next/image";
import { getPokemonTypeColors } from "@/features/pokemon/utils/pokemon-colors";
import Link from "next/link";

type PokemonAdjacentNavProps = {
  pokemonId: number;
};

export default async function PokemonAdjacentNav({
  pokemonId,
}: PokemonAdjacentNavProps) {
  try {
    const pokemon = await getPokemonAdjacent(pokemonId);

    const { typeColor1, typeColor2 } = getPokemonTypeColors(pokemon.types);

    const bgGradient = `bg-radial-[at_100%_100%] from-(--type-color2) via-(--type-color1) to-white/[0.045] from-0% via-40% to-80%`;

    return (
      <article
        style={
          {
            "--type-color1": typeColor1,
            "--type-color2": typeColor2,
          } as React.CSSProperties
        }
        className=""
      >
        <Link
          href={`/pokemon/${pokemon.name}`}
          className={`flex flex-col sm:flex-row gap-4 items-stretch justify-between p-3 sm:p-5 rounded-3xl border border-white/10 ${bgGradient} backdrop-blur-xl`}
        >
          <div className="sm:hidden">
            <PokemonAjdacentImage
              imageUrl={pokemon.imageUrl}
              displayName={pokemon.displayName}
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-2 justify-between w-full">
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium tracking-[0.18em] text-zinc-500">
                #{pokemon.pokedexNumber.toString().padStart(4, "0")}
              </span>
              <span className="text-2xl font-bold text-zinc-200 tracking-tight h-full">
                {pokemon.displayName}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <PokemonTypeBadge key={type} type={type} />
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <PokemonAjdacentImage
              imageUrl={pokemon.imageUrl}
              displayName={pokemon.displayName}
            />
          </div>
        </Link>
      </article>
    );
  } catch (err) {
    if (err instanceof PokeApiNotFoundError) {
      notFound();
    }

    throw err;
  }
}

type PokemonAjdacentImageProps = {
  imageUrl: string | null;
  displayName: string;
};

function PokemonAjdacentImage({
  imageUrl,
  displayName,
}: PokemonAjdacentImageProps) {
  return (
    <div className="relative h-24 sm:w-24 shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-black/20">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          sizes="96px"
          className="object-contain p-2 transition duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-300">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
