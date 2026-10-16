import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppPartnerCta } from "@/components/layout/whatsapp-partner-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig, siteUrl } from "@/lib/seo";

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
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: "Parceiros CPAD Belém | Lojas, produtos e serviços",
    template: "%s | Parceiros CPAD Belém",
  },
  description: siteConfig.description,
  keywords: [
    "parceiros CPAD Belém",
    "lojas parceiras em Belém",
    "produtos cristãos em Belém",
    "serviços em Belém",
    "empresas cristãs em Belém",
  ],
  alternates: {
    types: {
      "text/plain": absoluteUrl("/llms.txt"),
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteUrl("/parceiros"),
    siteName: siteConfig.name,
    title: "Parceiros CPAD Belém | Lojas, produtos e serviços",
    description: siteConfig.description,
    images: [{ url: absoluteUrl(siteConfig.socialImagePath), width: 1600, height: 500, alt: "Parceiros CPAD Belém" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parceiros CPAD Belém | Lojas, produtos e serviços",
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.socialImagePath)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const cookieTheme = cookieStore.get("cpad-admin-theme")?.value;
  const adminTheme = cookieTheme === "dark" || cookieTheme === "light" ? cookieTheme : undefined;

  return (
    <html lang="pt-BR" data-admin-theme={adminTheme}>
      <body className={`${sans.variable} ${heading.variable} ${geistMono.variable} antialiased`}>
        <Script id="admin-theme-bootstrap" strategy="beforeInteractive" nonce={nonce}>
          {adminThemeBootstrap}
        </Script>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${absoluteUrl("/")}#organization`,
                name: siteConfig.name,
                url: absoluteUrl("/parceiros"),
                logo: absoluteUrl(siteConfig.logoPath),
                description: siteConfig.description,
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  telephone: "+55-91-98127-1407",
                  email: "parcerias@cpadbelem.com.br",
                  availableLanguage: "Portuguese",
                },
              },
              {
                "@type": "WebSite",
                "@id": `${absoluteUrl("/")}#website`,
                url: absoluteUrl("/parceiros"),
                name: siteConfig.name,
                inLanguage: siteConfig.language,
                publisher: { "@id": `${absoluteUrl("/")}#organization` },
              },
            ],
          }}
        />
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
