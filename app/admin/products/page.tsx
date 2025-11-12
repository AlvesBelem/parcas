import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";
import { ProductSection } from "@/components/admin/product-section";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    fetchPartnerProducts({ page: 1, perPage: 50, includeInactive: true }),
    fetchProductCategoryOptions(),
  ]);
  return <ProductSection products={products.products} categories={categories} />;
}
