import Link from "next/link";

type PokedexSearchFormProps = {
  defaultQuery: string;
};

export function PokedexSearchForm({ defaultQuery }: PokedexSearchFormProps) {
  return (
    <section className="space-y-3">
      <form action="/" className="space-y-3">
        <label htmlFor="pokemon-search" className="text-sm text-zinc-300">
          Buscar Pokémon por nombre
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="pokemon-search"
            name="query"
            type="text"
            defaultValue={defaultQuery}
            placeholder="Ej. pikachu"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition focus:border-zinc-600"
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-50 px-5 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
          >
            Buscar
          </button>

          {defaultQuery ? (
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:border-zinc-700"
            >
              Limpiar
            </Link>
          ) : null}
        </div>
      </form>

      <p className="text-sm text-zinc-500">
        En esta fase la búsqueda es por nombre exacto. Más adelante podemos
        mejorarla con sugerencias, coincidencias parciales o un índice local.
      </p>
    </section>
  );
}
