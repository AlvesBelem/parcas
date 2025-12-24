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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent text-[#1f1a17]`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(176,42,32,0.14)_0,_transparent_65%)] blur-[20px]" />
            <div className="absolute right-[-8%] top-[20%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(243,197,107,0.18)_0,_transparent_60%)] blur-[14px]" />
            <div className="absolute left-1/2 bottom-[-12%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,28,22,0.16)_0,_transparent_70%)] blur-[26px]" />
          </div>
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="mt-8 border-t border-black/5 bg-[#b02a20] text-white">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div className="space-y-1">
                  <p className="text-[13px] uppercase tracking-[0.22em] text-white/80">
                    cpad belém • programa de parceiros
                  </p>
                  <p>© {new Date().getFullYear()} CPAD Belém. Rede oficial de parceiros confiáveis.</p>
                </div>
                <p className="text-white/80">
                  Transparência, segurança e atendimento humano em cada recomendação.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
