"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Header() {
  const searchParams = useSearchParams();

  function homeHref() {
    const fromParam = searchParams.get("from");

    const currentParams = fromParam
      ? new URL(decodeURIComponent(fromParam), "http://x").searchParams
      : searchParams;

    const params = new URLSearchParams();

    if (currentParams.has("mega")) params.set("mega", "true");
    if (currentParams.has("gmax")) params.set("gmax", "true");
    if (currentParams.has("regional")) params.set("regional", "true");

    const search = params.toString();

    return search ? `/?${search}` : "/";
  }

  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href={homeHref()}
          className="group inline-flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/icons/premierball.svg"
            alt="Pokeball"
            width={24}
            height={24}
            className="text-white"
          />
          <div>
            <p className="text-2xl tracking-tight">Pokédex</p>
          </div>
        </Link>

        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-300">
          Next.js · TypeScript · PokéAPI
        </span>
      </div>
    </header>
  );
}
