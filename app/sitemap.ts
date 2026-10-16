import type { MetadataRoute } from "next";

import { fetchPartners } from "@/lib/data/partners";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchServices } from "@/lib/data/services";
import { absoluteUrl } from "@/lib/seo";

const SITEMAP_BATCH_SIZE = 50_000;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [partners, products, services] = await Promise.all([
    fetchPartners({ page: 1, perPage: SITEMAP_BATCH_SIZE }),
    fetchPartnerProducts({ page: 1, perPage: SITEMAP_BATCH_SIZE }),
    fetchServices({ page: 1, perPage: SITEMAP_BATCH_SIZE }),
  ]);

  return [
    { url: absoluteUrl("/parceiros"), lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/produtos"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/servicos"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/seja-um-parceiro"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...partners.partners.map((partner) => ({
      url: absoluteUrl(`/parceiros/${partner.slug}`),
      lastModified: partner.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.products.map((product) => ({
      url: absoluteUrl(`/produtos/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...services.services.map((service) => ({
      url: absoluteUrl(`/servicos/${service.slug}`),
      lastModified: service.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
