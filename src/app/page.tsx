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
          <section className="mb-10 space-y-4">
            <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
              Fase 4.5 · Live search
            </span>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Pokédex
              </h1>

              <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                Búsqueda reactiva con URL y coincidencias parciales sobre toda
                la Pokédex.
              </p>
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
        <section className="mb-10 space-y-4">
          <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
            Fase 4.5 · Live search
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pokédex
            </h1>

            <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Búsqueda reactiva con URL y coincidencias parciales sobre toda la
              Pokédex.
            </p>
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
