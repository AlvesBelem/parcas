import {
  fetchCategoriesWithStats,
  mergeCategoriesForAdmin,
  type AdminCategoryEntry,
} from "@/lib/data/categories";
import { fetchProductCategoriesWithStats } from "@/lib/data/product-categories";
import { CategorySection } from "@/components/admin/category-section";

export default async function AdminCategoriesPage() {
  const [categories, productCategories] = await Promise.all([
    fetchCategoriesWithStats(),
    fetchProductCategoriesWithStats(),
  ]);

  const merged: AdminCategoryEntry[] = mergeCategoriesForAdmin(categories, productCategories);

  return (
    <div className="space-y-8">
      <CategorySection categories={merged} />
    </div>
  );
}
