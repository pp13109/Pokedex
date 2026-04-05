import { PokedexLiveSearch } from "@/features/pokemon/components/pokedex-live-search";
import { PokemonGrid } from "@/features/pokemon/components/pokemon-grid";
import { PokemonPagination } from "@/features/pokemon/components/pokemon-pagination";
import {
  DEFAULT_PAGE_SIZE,
  getPokemonList,
  searchPokemonList,
} from "@/features/pokemon/server/pokemon-service";

type HomePageProps = {
  searchParams: Promise<{
    page?: string | string[];
    query?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parsePage(value: string) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const query = getSingleSearchParam(resolvedSearchParams.query).trim();
  const requestedPage = parsePage(
    getSingleSearchParam(resolvedSearchParams.page),
  );

  try {
    if (query) {
      const { totalMatches, results } = await searchPokemonList(
        query,
        requestedPage,
        DEFAULT_PAGE_SIZE,
      );

      const totalPages = Math.max(
        1,
        Math.ceil(totalMatches / DEFAULT_PAGE_SIZE),
      );

      return (
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
          <section className="mb-10 space-y-6">
            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-200">
              Fase 6 · Visual system
            </span>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Una Pokédex moderna, clara y pensada como producto real.
                </h1>

                <p className="max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                  Ahora estamos fortaleciendo la identidad visual, la jerarquía
                  de información y las microinteracciones de la interfaz.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                <p className="text-sm text-zinc-400">Estado del proyecto</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">Data layer</span>
                    <span className="font-medium text-emerald-300">Listo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">Búsqueda reactiva</span>
                    <span className="font-medium text-emerald-300">Listo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">Sistema visual</span>
                    <span className="font-medium text-indigo-300">
                      En progreso
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <PokedexLiveSearch initialQuery={query} />

            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Resultados de búsqueda
              </h2>

              <p className="text-sm text-zinc-400">
                Mostrando {results.length} resultado(s) en la página{" "}
                <span className="font-medium text-zinc-200">
                  {requestedPage}
                </span>{" "}
                para <span className="font-medium text-zinc-200">{query}</span>.
              </p>
            </section>

            <PokemonGrid
              pokemon={results}
              emptyMessage={`No encontramos coincidencias para "${query}".`}
            />

            <PokemonPagination
              currentPage={requestedPage}
              totalPages={totalPages}
              query={query}
            />
          </div>
        </main>
      );
    }

    const offset = (requestedPage - 1) * DEFAULT_PAGE_SIZE;
    const { count, results } = await getPokemonList({
      limit: DEFAULT_PAGE_SIZE,
      offset,
    });

    const totalPages = Math.max(1, Math.ceil(count / DEFAULT_PAGE_SIZE));

    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
        <section className="mb-10 space-y-6">
          <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-200">
            Fase 6 · Visual system
          </span>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Una Pokédex moderna, clara y pensada como producto real.
              </h1>

              <p className="max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Ahora estamos fortaleciendo la identidad visual, la jerarquía de
                información y las microinteracciones de la interfaz.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
              <p className="text-sm text-zinc-400">Estado del proyecto</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Data layer</span>
                  <span className="font-medium text-emerald-300">Listo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Búsqueda reactiva</span>
                  <span className="font-medium text-emerald-300">Listo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Sistema visual</span>
                  <span className="font-medium text-indigo-300">
                    En progreso
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          <PokedexLiveSearch initialQuery="" />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Listado de Pokémon
            </h2>

            <p className="text-sm text-zinc-400">
              Mostrando la página{" "}
              <span className="font-medium text-zinc-200">{requestedPage}</span>{" "}
              de <span className="font-medium text-zinc-200">{totalPages}</span>
              .
            </p>
          </section>

          <PokemonGrid pokemon={results} />

          <PokemonPagination
            currentPage={requestedPage}
            totalPages={totalPages}
            query=""
          />
        </div>
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
