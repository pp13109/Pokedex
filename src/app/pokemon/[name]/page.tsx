import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PokeApiNotFoundError } from "@/features/pokemon/server/pokemon-api";
import { getPokemonByName } from "@/features/pokemon/server/pokemon-service";
import { PokemonTypeBadge } from "@/features/pokemon/components/pokemon-type-badge"

type PokemonDetailPageProps = {
  params: Promise<{
    name: string;
  }>;
};

export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { name } = await params;

  try {
    const pokemon = await getPokemonByName(name);

    return {
      title: `${pokemon.name} · Pokédex`,
      description: `Consulta datos de ${pokemon.name}, incluyendo tipos, habilidades, altura, peso y stats base.`,
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
}: PokemonDetailPageProps) {
  const { name } = await params;

  try {
    const pokemon = await getPokemonByName(name);

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            ← Volver a la Pokédex
          </Link>
        </div>

        <article className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.045] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:grid-cols-[320px_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
            <div className="relative mx-auto h-64 w-64">
              {pokemon.imageUrl ? (
                <Image
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <p className="text-sm text-zinc-400">
                #{pokemon.id.toString().padStart(4, "0")}
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {pokemon.name}
              </h1>

              <ul
                className="flex flex-wrap gap-2"
                aria-label={`Tipos de ${pokemon.name}`}
              >
                {pokemon.types.map((type) => (
                  <li key={type}>
                    <PokemonTypeBadge type={type} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-zinc-500">Altura</p>
                <p className="mt-2 text-2xl font-semibold">
                  {pokemon.heightMeters} m
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-zinc-500">Peso</p>
                <p className="mt-2 text-2xl font-semibold">
                  {pokemon.weightKg} kg
                </p>
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
                    className="rounded-[24px] border border-white/10 bg-black/20 p-4"
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

            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Stats base
              </h2>

              <ul className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <li key={stat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{stat.name}</span>
                      <span className="text-zinc-500">{stat.value}</span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-zinc-800"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-zinc-200"
                        style={{ width: `${Math.min(stat.value, 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>
    );
  } catch (error) {
    if (error instanceof PokeApiNotFoundError) {
      notFound();
    }

    throw error;
  }
}
