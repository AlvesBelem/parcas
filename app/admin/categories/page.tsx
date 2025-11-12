import { fetchCategoriesWithStats } from "@/lib/data/categories";
import { fetchProductCategoriesWithStats } from "@/lib/data/product-categories";
import { CategorySection } from "@/components/admin/category-section";
import { ProductCategoryForm } from "@/components/admin/product-category-form";
import { ProductCategoryList } from "@/components/admin/product-category-list";

export default async function AdminCategoriesPage() {
  const [categories, productCategories] = await Promise.all([
    fetchCategoriesWithStats(),
    fetchProductCategoriesWithStats(),
  ]);

  return (
    <div className="space-y-8">
      <CategorySection categories={categories} />
      <section className="grid gap-6 xl:grid-cols-2">
        <ProductCategoryForm />
        <ProductCategoryList categories={productCategories} />
      </section>
    </div>
  );
}
