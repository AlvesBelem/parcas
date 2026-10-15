import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
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
  title: "Parceiros CPAD Belém | Diretório de parceiros",
  description: "Conheça empresas, produtos e serviços parceiros da CPAD Belém.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${playfair.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col overflow-x-clip">
          <SiteHeader />
          <main className="mx-auto w-full max-w-360 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            {children}
          </main>
          <SiteFooter />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
