import { PokedexClient } from "@/features/pokemon/components/pokedex-client";
import { getPokemonList } from "@/features/pokemon/server/pokemon-service";

export default async function Home() {
  try {
    const { results } = await getPokemonList({ limit: 12 });

    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
        <section className="mb-10 space-y-4">
          <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
            Fase 3 · Real data layer
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pokédex
            </h1>

            <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Ahora la aplicación consume datos reales de PokéAPI mediante una
              capa de servidor tipada y normalizada.
            </p>
          </div>
        </section>

        <PokedexClient initialPokemon={results} />
      </main>
    );
  } catch (error) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-red-900/60 bg-red-950/30 px-3 py-1 text-sm text-red-200">
            Error de carga
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              No pudimos cargar la Pokédex
            </h1>

            <p className="max-w-2xl text-zinc-400">
              Hubo un problema al consultar la API. Revisa tu conexión y vuelve
              a intentar.
            </p>
          </div>
        </section>
      </main>
    );
  }
}
