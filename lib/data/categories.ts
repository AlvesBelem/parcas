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

export type AdminCategoryEntry = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: Date;
  partnerCount: number;
  productCount: number;
  partnerId: string | null;
  productCategoryId: string | null;
  scope: "partners" | "products" | "both";
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

export function mergeCategoriesForAdmin(
  categories: CategoryWithStats[],
  productCategories: { id: string; name: string; slug: string; description: string | null; createdAt: Date; productCount: number }[],
): AdminCategoryEntry[] {
  const map = new Map<string, AdminCategoryEntry>();

  categories.forEach((category) => {
    map.set(category.slug, {
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      partnerCount: category.partnerCount,
      productCount: 0,
      partnerId: category.id,
      productCategoryId: category.productCategoryId,
      scope: category.productCategoryId ? "both" : "partners",
    });
  });

  productCategories.forEach((productCategory) => {
    const existing = map.get(productCategory.slug);
    if (existing) {
      existing.productCategoryId = productCategory.id;
      existing.productCount = productCategory.productCount;
      existing.scope = existing.partnerId ? "both" : "products";
      // keep earliest createdAt from partner category; otherwise use product category date
    } else {
      map.set(productCategory.slug, {
        id: productCategory.id,
        slug: productCategory.slug,
        name: productCategory.name,
        description: productCategory.description,
        createdAt: productCategory.createdAt,
        partnerCount: 0,
        productCount: productCategory.productCount,
        partnerId: null,
        productCategoryId: productCategory.id,
        scope: "products",
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
