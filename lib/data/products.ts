import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type PartnerProductSummary = {
  id: string;
  name: string;
  slug: string;
  platform: string;
  url: string;
  imageUrls: string[];
  description?: string | null;
  clickCount: number;
  active: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type PartnerProductQueryResult = {
  products: PartnerProductSummary[];
  total: number;
  page: number;
  perPage: number;
};

export const DEFAULT_PRODUCT_PAGE_SIZE = 12;

export async function fetchPartnerProducts({
  page = 1,
  perPage = DEFAULT_PRODUCT_PAGE_SIZE,
  includeInactive = false,
  categorySlug,
}: {
  page?: number;
  perPage?: number;
  includeInactive?: boolean;
  categorySlug?: string | null;
} = {}): Promise<PartnerProductQueryResult> {
  const currentPage = Math.max(page, 1);
  const take = perPage;
  const skip = (currentPage - 1) * take;

  const where: Prisma.PartnerProductWhereInput = {};

  if (!includeInactive) {
    where.active = true;
  }

  if (categorySlug) {
    where.category = {
      is: {
        slug: {
          equals: categorySlug,
          mode: "insensitive",
        },
      },
    };
  }

  const [products, total] = await Promise.all([
    prisma.partnerProduct.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.partnerProduct.count({ where }),
  ]);

  return {
    products: products.map((product) => ({
      ...product,
      imageUrls: product.imageUrls ?? [],
    })),
    total,
    page: currentPage,
    perPage: take,
  };
}
