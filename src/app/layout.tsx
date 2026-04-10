import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MotionProvider } from "@/shared/components/motion-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pokédex",
    template: "%s",
  },
  description: "Pokédex construida con Next.js, TypeScript y PokéAPI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen text-zinc-50 antialiased">
        <MotionProvider>
          <div className="relative min-h-screen">
            <header className="sticky top-0 z-40 bg-white/[0.045] backdrop-blur-xl">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="group inline-flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-transform duration-300 group-hover:scale-105">
                    <span className="text-base font-black tracking-tight">
                      Pk
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl tracking-tight">Pokédex</p>
                  </div>
                </Link>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  Next.js · TypeScript · PokéAPI
                </span>
              </div>
            </header>

            {children}
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
