"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PokemonPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function PokemonPagination({
  currentPage,
  totalPages,
}: PokemonPaginationProps) {
  const searchParams = useSearchParams();

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  function createPageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", String(page));
    }
    else {
      params.delete("page");
    }

    const search = params.toString();

    return search ? `/?${search}` : "/";
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación de la Pokédex"
      className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/4.5 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-zinc-400">
        Página <span className="font-medium text-zinc-100">{currentPage}</span>{" "}
        de <span className="font-medium text-zinc-100">{totalPages}</span>
      </p>
      <div className="flex gap-3">
        {hasPreviousPage ? (
          <Link
            href={createPageHref(currentPage - 1)}
            className="inline-flex rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
            aria-label={`Ir a la página ${currentPage - 1}`}
          >
            Anterior
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-600"
            aria-disabled="true"
          >
            Anterior
          </span>
        )}

        {hasNextPage ? (
          <Link
            href={createPageHref(currentPage + 1)}
            className="inline-flex rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
            aria-label={`Ir a la página ${currentPage + 1}`}
          >
            Siguiente
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-500"
            aria-disabled="true"
          >
            Siguiente
          </span>
        )}
      </div>
    </nav>
  );
}
