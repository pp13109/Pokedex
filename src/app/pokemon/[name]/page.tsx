import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PokeApiNotFoundError } from "@/features/pokemon/server/pokemon-api";
import { getPokemonDetail } from "@/features/pokemon/server/pokemon-service";
import { PokemonTypeBadge } from "@/features/pokemon/components/pokemon-type-badge";
import { getPokemonTypeColors } from "@/features/pokemon/utils/pokemon-colors";
import { PokemonDetailImages } from "@/features/pokemon/components/pokemon-detail-images";
import { AnimatedReveal } from "@/shared/components/animated-reveal";
import PokedexDescriptions from "@/features/pokemon/components/pokedex-descriptions";
import { PokemonEvolutionChainList } from "@/features/pokemon/components/pokemon-evolution-chain";
import PokemonStatsTabs from "@/features/pokemon/components/pokemon-stats-tabs";
import PokemonAdjacentNav from "@/features/pokemon/components/pokemon-adjacent-nav";
import { FaArrowLeftLong } from "react-icons/fa6";

type PokemonDetailPageProps = {
  params: Promise<{
    name: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { name } = await params;

  try {
    const pokemon = await getPokemonDetail(name);

    return {
      title: `${pokemon.displayName} · Pokédex`,
      description: `Consulta datos de ${pokemon.displayName}, incluyendo tipos, habilidades, altura, peso y stats base.`,
    };
  } catch (error) {
    return {
      title: "Pokémon no encontrado · Pokédex",
      description: "No pudimos encontrar el Pokémon solicitado.",
    };
  }
}

export default async function PokemonDetailPage({
  params,
  searchParams,
}: PokemonDetailPageProps) {
  const { name } = await params;
  const { from } = await searchParams;

  const backHref = from ? decodeURIComponent(from) : "/";

  try {
    const pokemon = await getPokemonDetail(name);

    const { typeColor1, typeColor2 } = getPokemonTypeColors(pokemon.types);

    const bgGradient = `bg-gradient-to-t from-(--type-color2) via-(--type-color1) to-white/5 from-0% via-40% to-80%`;

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <div className="mb-8">
          <Link
            href={backHref}
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            <div className="flex flex-row gap-2 items-center font-semibold tracking-wide border border-white/10 bg-black/20 w-fit px-5 py-2 rounded-full backdrop-blur-2xl">
              <FaArrowLeftLong />
              <span>Volver a la Pokédex</span>
            </div>
          </Link>
        </div>
        <AnimatedReveal>
          <article
            style={
              {
                "--type-color1": typeColor1,
                "--type-color2": typeColor2,
              } as React.CSSProperties
            }
            className={`flex flex-col gap-8 rounded-[28px] border border-white/10 ${bgGradient} p-8 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl`}
          >
            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
              <div className="flex flex-col gap-10 min-w-0">
                <PokemonDetailImages
                  name={pokemon.displayName}
                  imageUrl={pokemon.imageUrl}
                  imageUrlShiny={pokemon.imageUrlShiny}
                />

                <PokedexDescriptions pokemon={pokemon} />
              </div>

              <div className="space-y-4">
                <section className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    #{pokemon.pokedexNumber.toString().padStart(4, "0")}
                  </p>

                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {pokemon.displayName}
                  </h1>

                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <ul
                      className="flex flex-wrap gap-2"
                      aria-label={`Tipos de ${pokemon.displayName}`}
                    >
                      {pokemon.types.map((type) => (
                        <li key={type}>
                          <PokemonTypeBadge type={type} />
                        </li>
                      ))}
                    </ul>

                    <section className="flex justify-evenly gap-4">
                      <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-2 w-fit flex items-end gap-2">
                        <p className="text-sm text-zinc-500">Altura</p>
                        <p className="text-l font-semibold">
                          {pokemon.heightMeters} m
                        </p>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-2 w-fit flex items-end gap-2">
                        <p className="text-sm text-zinc-500">Peso</p>
                        <p className="text-l font-semibold">
                          {pokemon.weightKg} kg
                        </p>
                      </div>
                    </section>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Habilidades
                  </h2>

                  <ul className="grid gap-3 sm:grid-cols-2">
                    {pokemon.abilities.map((ability) => (
                      <li
                        key={`${ability.name}-${ability.isHidden ? "hidden" : "normal"}`}
                        className="rounded-3xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium">{ability.name}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {ability.isHidden
                            ? "Habilidad oculta"
                            : "Habilidad normal"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                <PokemonStatsTabs
                  statsBase={pokemon.statsBase}
                  statsMin={pokemon.statsMin}
                  statsMax={pokemon.statsMax}
                />
              </div>
            </div>

            {pokemon.evolutionChain.length > 1 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Evoluciones
                </h2>

                <PokemonEvolutionChainList
                  evolutionChain={pokemon.evolutionChain}
                  activePokemon={pokemon.name}
                />
              </section>
            )}
          </article>

          <section className="grid grid-cols-2 gap-4 sm:gap-10 mt-10">
            {pokemon.pokedexNumber > 1 ? (
              <PokemonAdjacentNav pokemonId={pokemon.pokedexNumber - 1} />
            ) : (
              <div />
            )}
            {pokemon.pokedexNumber < 1025 ? (
              <PokemonAdjacentNav pokemonId={pokemon.pokedexNumber + 1} />
            ) : (
              <div />
            )}
          </section>
        </AnimatedReveal>
      </main>
    );
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) {
      notFound();
    }

    throw error;
  }
}
