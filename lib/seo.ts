import { getSafeExternalUrl } from "@/lib/url-security";

const FALLBACK_SITE_URL = "https://parceiros.cpadbelem.com.br";

function normalizeSiteUrl(value: string | undefined) {
  const rawUrl = value?.trim();
  if (!rawUrl) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
);

export const siteConfig = {
  name: "Parceiros CPAD Belém",
  description: "Diretório de lojas, produtos afiliados e serviços parceiros da CPAD Belém.",
  locale: "pt_BR",
  language: "pt-BR",
  logoPath: "/logo_cpad_belem.svg",
  socialImagePath: "/hero-parceiros.png",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function urlOrAbsoluteUrl(value: string | null | undefined, fallbackPath: string) {
  return getSafeExternalUrl(value)?.toString() ?? absoluteUrl(fallbackPath);
}

export function metaDescription(value: string | null | undefined, fallback: string) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  if (!normalized) return fallback;
  return normalized.length > 155 ? `${normalized.slice(0, 152).trimEnd()}…` : normalized;
}

export function jsonLdStringify(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
