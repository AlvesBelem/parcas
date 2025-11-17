import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nosite | Lojas Parceiras Confiáveis",
  description:
    "Catálogo oficial de parceiros autorizados da Nosite. Todos verificados e acompanhados com transparência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-10%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-lime-400/20 blur-[160px]" />
            <div className="absolute right-0 top-1/2 h-[260px] w-[260px] translate-x-1/3 rounded-full bg-indigo-500/20 blur-[180px]" />
          </div>
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto w-full max-w-[95vw] px-6 py-12">{children}</main>
            <footer className="border-t border-white/10 bg-zinc-950/80">
              <div className="mx-auto flex w-full max-w-[95vw] flex-col gap-2 px-6 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} Nosite - Rede oficial de parceiros.</p>
                <p className="text-white/40">
                  Transparência, segurança e confiança em cada indicação.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
