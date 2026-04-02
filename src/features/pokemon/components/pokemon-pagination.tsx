import Link from "next/link";

type PokemonPaginationProps = {
  currentPage: number;
  totalPages: number;
  query: string;
};

function createPageHref(page: number, query: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (query.trim()) {
    params.set("query", query.trim());
  }

  const search = params.toString();

  return search ? `/?${search}` : "/";
}

export function PokemonPagination({
  currentPage,
  totalPages,
  query,
}: PokemonPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav
      aria-label="Paginación de la Pokédex"
      className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-zinc-400">
        Página <span className="font-medium text-zinc-100">{currentPage}</span>{" "}
        de <span className="font-medium text-zinc-100">{totalPages}</span>
      </p>

      <div className="flex gap-3">
        {hasPreviousPage ? (
          <Link
            href={createPageHref(currentPage - 1, query)}
            className="inline-flex rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
          >
            Anterior
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-600">
            Anterior
          </span>
        )}

        {hasNextPage ? (
          <Link
            href={createPageHref(currentPage + 1, query)}
            className="inline-flex rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
          >
            Siguiente
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-500">
            Siguiente
          </span>
        )}
      </div>
    </nav>
  );
}
