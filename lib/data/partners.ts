import { Partner, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { fetchCategoryBySlug } from "@/lib/data/categories";

export type PartnerSummary = Pick<
  Partner,
  "id" | "name" | "category" | "logoUrl" | "url" | "description" | "slug" | "createdAt" | "active" | "clickCount"
>;

export type PartnerQueryResult = {
  partners: PartnerSummary[];
  total: number;
  page: number;
  perPage: number;
};

export const DEFAULT_PAGE_SIZE = 8;

export async function fetchPartners({
  categorySlug,
  page = 1,
  perPage = DEFAULT_PAGE_SIZE,
  includeInactive = false,
}: {
  categorySlug?: string | null;
  page?: number;
  perPage?: number;
  includeInactive?: boolean;
}): Promise<PartnerQueryResult> {
  const currentPage = Math.max(page, 1);
  const take = perPage;
  const skip = (currentPage - 1) * take;
  const categoryForFilter = categorySlug
    ? await fetchCategoryBySlug(categorySlug)
    : null;

  if (categorySlug && !categoryForFilter) {
    return {
      partners: [],
      total: 0,
      page: currentPage,
      perPage: take,
    };
  }

  const where: Prisma.PartnerWhereInput = {};

  if (categoryForFilter) {
    where.category = {
      equals: categoryForFilter.name,
      mode: "insensitive",
    };
  }

  if (!includeInactive) {
    where.active = true;
  }

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    }),
    prisma.partner.count({ where }),
  ]);

  return {
    partners,
    total,
    page: currentPage,
    perPage: take,
  };
}
