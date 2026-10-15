import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const serviceInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
} satisfies Prisma.ServiceInclude;

export type ServiceSummary = Prisma.ServiceGetPayload<{ include: typeof serviceInclude }>;

export type ServiceCategoryOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export async function fetchServiceCategoryOptions(): Promise<ServiceCategoryOption[]> {
  return prisma.serviceCategory.findMany({
    select: { id: true, name: true, slug: true, description: true },
    orderBy: { name: "asc" },
  });
}

export async function fetchServices({
  categorySlug,
  search,
  includeInactive = false,
  page = 1,
  perPage = 24,
}: {
  categorySlug?: string | null;
  search?: string | null;
  includeInactive?: boolean;
  page?: number;
  perPage?: number;
} = {}) {
  const currentPage = Math.max(page, 1);
  const where: Prisma.ServiceWhereInput = {
    ...(includeInactive ? {} : { active: true }),
    ...(categorySlug
      ? { category: { is: { slug: { equals: categorySlug, mode: "insensitive" } } } }
      : {}),
  };
  if (search?.trim()) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { category: { is: { name: { contains: term, mode: "insensitive" } } } },
    ];
  }
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: serviceInclude,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.service.count({ where }),
  ]);
  return { services, total, page: currentPage, perPage };
}

export async function fetchServiceBySlug(slug: string, { includeInactive = false }: { includeInactive?: boolean } = {}) {
  return prisma.service.findFirst({
    where: { slug, ...(includeInactive ? {} : { active: true }) },
    include: serviceInclude,
  });
}
