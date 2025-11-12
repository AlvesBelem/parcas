import { prisma } from "@/lib/prisma";

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryWithStats = CategoryOption & {
  description: string | null;
  createdAt: Date;
  partnerCount: number;
  productCategoryId: string | null;
};

export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function fetchCategoriesWithStats(): Promise<CategoryWithStats[]> {
  const [categories, partnerGroups, productCategories] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.partner.groupBy({
      by: ["category"],
      _count: { category: true },
    }),
    prisma.productCategory.findMany({
      select: { id: true, slug: true },
    }),
  ]);

  const countMap = new Map(
    partnerGroups.map((group) => [
      group.category.toLowerCase(),
      group._count.category,
    ]),
  );

  const productMap = new Map(
    productCategories.map((category) => [category.slug, category.id]),
  );

  return categories.map((category) => ({
    ...category,
    partnerCount: countMap.get(category.name.toLowerCase()) ?? 0,
    productCategoryId: productMap.get(category.slug) ?? null,
  }));
}

export async function fetchCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}
