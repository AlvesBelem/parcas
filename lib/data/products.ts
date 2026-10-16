import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type PartnerProductSummary = {
  id: string;
  name: string;
  slug: string;
  platform: string;
  url: string;
  whatsappNumber: string | null;
  ctaLabel: string;
  ctaColor: string;
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
  search,
}: {
  page?: number;
  perPage?: number;
  includeInactive?: boolean;
  categorySlug?: string | null;
  search?: string | null;
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

  if (search?.trim()) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { platform: { contains: term, mode: "insensitive" } },
      { category: { is: { name: { contains: term, mode: "insensitive" } } } },
    ];
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

export async function fetchPartnerProductBySlug(
  slug: string,
  { includeInactive = false }: { includeInactive?: boolean } = {},
): Promise<PartnerProductSummary | null> {
  const where: Prisma.PartnerProductWhereUniqueInput = { slug };

  const product = await prisma.partnerProduct.findUnique({
    where,
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) return null;
  if (!includeInactive && !product.active) return null;

  return {
    ...product,
    imageUrls: product.imageUrls ?? [],
  };
}
