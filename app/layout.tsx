import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppPartnerCta } from "@/components/layout/whatsapp-partner-cta";

const sans = DM_Sans({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

const heading = Fraunces({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  axes: ["opsz", "SOFT"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const adminThemeBootstrap = `(function () {
  try {
    var isAdmin = window.location.pathname === "/admin" || window.location.pathname.indexOf("/admin/") === 0;
    if (!isAdmin || document.documentElement.hasAttribute("data-admin-theme")) return;

    var theme = window.localStorage.getItem("cpad-admin-theme") === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-admin-theme", theme);
  } catch (_) {}
})();`;

export const metadata: Metadata = {
  title: "Parceiros CPAD Belém | Diretório de parceiros",
  description: "Conheça empresas, produtos e serviços parceiros da CPAD Belém.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("cpad-admin-theme")?.value;
  const adminTheme = cookieTheme === "dark" || cookieTheme === "light" ? cookieTheme : undefined;

  return (
    <html lang="pt-BR" data-admin-theme={adminTheme}>
      <body className={`${sans.variable} ${heading.variable} ${geistMono.variable} antialiased`}>
        <Script id="admin-theme-bootstrap" strategy="beforeInteractive">
          {adminThemeBootstrap}
        </Script>
        <div className="flex min-h-screen flex-col overflow-x-clip">
          <SiteHeader />
          <main className="mx-auto w-full max-w-360 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppPartnerCta />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
