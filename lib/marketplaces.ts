export type Marketplace = {
  id: string;
  label: string;
  ctaLabel: string;
  ctaColor: string;
  ctaTextColor: "#ffffff" | "#202020";
};

export const marketplaces: Marketplace[] = [
  { id: "Shopee", label: "Shopee", ctaLabel: "Comprar na Shopee", ctaColor: "#EE4D2D", ctaTextColor: "#ffffff" },
  { id: "Amazon", label: "Amazon", ctaLabel: "Comprar na Amazon", ctaColor: "#FF9900", ctaTextColor: "#202020" },
  { id: "Mercado Livre", label: "Mercado Livre", ctaLabel: "Comprar no Mercado Livre", ctaColor: "#FFE600", ctaTextColor: "#202020" },
  { id: "Magalu", label: "Magalu", ctaLabel: "Comprar no Magalu", ctaColor: "#0086FF", ctaTextColor: "#ffffff" },
  { id: "AliExpress", label: "AliExpress", ctaLabel: "Comprar no AliExpress", ctaColor: "#FF4747", ctaTextColor: "#ffffff" },
];

export function getMarketplace(platform?: string | null) {
  const normalized = normalizePlatform(platform);
  return marketplaces.find((item) => normalizePlatform(item.id) === normalized) ?? null;
}

export function getMarketplaceCta({
  platform,
  fallbackLabel,
  fallbackColor,
}: {
  platform?: string | null;
  fallbackLabel?: string | null;
  fallbackColor?: string | null;
}) {
  const marketplace = getMarketplace(platform);
  if (marketplace) {
    return {
      label: marketplace.ctaLabel,
      color: marketplace.ctaColor,
      textColor: marketplace.ctaTextColor,
    };
  }
  return {
    label: fallbackLabel?.trim() || "Ir para o link oficial",
    color: fallbackColor?.trim() || "#750B2A",
    textColor: "#ffffff" as const,
  };
}

function normalizePlatform(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
