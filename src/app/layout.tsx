import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { MotionProvider } from "@/shared/components/motion-provider";
import Header from "@/shared/components/header";

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
            <Header />

            {children}
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
