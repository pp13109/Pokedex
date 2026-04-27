import type { ReactNode } from "react";
import { PokedexLiveSearch } from "@/features/pokemon/components/pokedex-live-search";
import { PokemonGrid } from "@/features/pokemon/components/pokemon-grid";
import { PokemonPagination } from "@/features/pokemon/components/pokemon-pagination";
import { getPokemonList } from "@/features/pokemon/server/pokemon-service";
import type { PokemonListItem } from "@/features/pokemon/types/pokemon-list-item";
import { AnimatedReveal } from "@/shared/components/animated-reveal";
import { PokedexFilters } from "@/features/pokemon/components/pokedex-filters";
import { getSingleSearchParam } from "@/shared/utils/search-params";
import { parsePage } from "@/features/pokemon/utils/pagination";

type HomePageProps = {
  searchParams: Promise<{
    page?: string | string[];
    query?: string | string[];
    mega?: string | string[];
    gmax?: string | string[];
    regional?: string | string[];
  }>;
};

type ListHomeView = {
  query: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  fullListItems: number;
  results: PokemonListItem[];
};

async function getHomeView(
  query: string,
  requestedPage: number,
  filters: {
    filterMega: boolean;
    filterGmax: boolean;
    filterRegional: boolean;
  },
): Promise<ListHomeView> {
  const { totalItems, totalPages, currentPage, fullListItems, results } =
    await getPokemonList({
      query,
      page: requestedPage,
      filters,
    });

  return { query, totalItems, totalPages, currentPage, fullListItems, results };
}

function HomePageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <AnimatedReveal>
        <HomePageHeader />
      </AnimatedReveal>

      <AnimatedReveal delay={0.2}>
        <div className="space-y-8">{children}</div>
      </AnimatedReveal>
    </main>
  );
}

function HomePageHeader() {
  return (
    <section className="mb-10 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Pokédex
            </h1>
            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 mb-1.5 text-xs lg:text-sm text-indigo-200">
              v 2.1
            </span>
          </div>

          <p className="max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Explora la información completa de tus Pokémon favoritos: tipos,
            habilidades, estadísticas base y mucho más.
          </p>
        </div>
      </div>
    </section>
  );
}

function HomePagePokemonList({ view }: { view: ListHomeView }) {
  const { query, totalItems, totalPages, currentPage, fullListItems, results } =
    view;

  return (
    <HomePageShell>
      <section className="flex flex-row gap-12">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Listado
          </span>
          <span className="text-sm font-medium text-zinc-200 tracking-wider">
            {totalItems.toString().padStart(2, "0")} /{" "}
            {fullListItems.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Página
          </span>
          <span className="text-sm font-medium text-zinc-200 tracking-wider">
            {currentPage.toString().padStart(2, "0")} /{" "}
            {totalPages.toString().padStart(2, "0")}
          </span>
        </div>
      </section>

      <PokedexFilters />

      <PokedexLiveSearch initialQuery={query} />

      <PokemonGrid
        pokemon={results}
        emptyMessage={`No encontramos coincidencias para "${query}".`}
      />

      <PokemonPagination currentPage={currentPage} totalPages={totalPages} />

      <div className="min-h-50"></div>
    </HomePageShell>
  );
}

function HomePageError() {
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
            Hubo un problema al consultar la API. Revisa tu conexión y vuelve a
            intentar.
          </p>
        </div>
      </section>
    </main>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const query = getSingleSearchParam(resolvedSearchParams.query).trim();
  const requestedPage = parsePage(
    getSingleSearchParam(resolvedSearchParams.page),
  );
  const filters = {
    filterMega: getSingleSearchParam(resolvedSearchParams.mega) === "true",
    filterGmax: getSingleSearchParam(resolvedSearchParams.gmax) === "true",
    filterRegional:
      getSingleSearchParam(resolvedSearchParams.regional) === "true",
  };

  try {
    const view = await getHomeView(query, requestedPage, filters);

    return <HomePagePokemonList view={view} />;
  } catch (error) {
    console.error("Error loading Pokédex:", error);
    return <HomePageError />;
  }
}
