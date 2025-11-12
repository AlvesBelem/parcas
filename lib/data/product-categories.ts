import { prisma } from "@/lib/prisma";

export type ProductCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type ProductCategoryWithStats = ProductCategoryOption & {
  description: string | null;
  createdAt: Date;
  productCount: number;
};

export async function fetchProductCategoryOptions(): Promise<ProductCategoryOption[]> {
  const categories = await prisma.productCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function fetchProductCategoriesWithStats(): Promise<ProductCategoryWithStats[]> {
  const [categories, counts] = await Promise.all([
    prisma.productCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.partnerProduct.groupBy({
      by: ["categoryId"],
      _count: { categoryId: true },
    }),
  ]);

  const countMap = new Map(
    counts.map((entry) => [entry.categoryId, entry._count.categoryId]),
  );

  return categories.map((category) => ({
    ...category,
    productCount: countMap.get(category.id) ?? 0,
  }));
}
