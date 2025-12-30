import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CPAD Belém | Rede de Parceiros e Loja Oficial",
  description:
    "Catálogo oficial dos parceiros e produtos da CPAD Belém. Conteúdo curado, cliques seguros e vitrine alinhada ao site principal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-transparent text-[#2f1d15]`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="mt-10 bg-[#b02b24] text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/80">
                  CPAD Belém • Rede oficial
                </p>
                <p className="text-lg font-semibold">Conte com nosso time para compras seguras.</p>
              </div>
              <div className="text-sm text-white/90">
                <p>📞 (91) 98127-1407</p>
                <p>✉️ parcerias@cpadbelem.com.br</p>
              </div>
            </div>
            <div className="bg-[#9a241f]">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>© {new Date().getFullYear()} CPAD Belém. Todos os direitos reservados.</p>
                <p>Transparência e suporte humano em cada clique.</p>
              </div>
            </div>
          </footer>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
