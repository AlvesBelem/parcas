import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";
import { ProductSection } from "@/components/admin/product-section";
import { fetchFeaturedBannerSchedules } from "@/lib/data/featured-banners";

export default async function AdminProductsPage() {
  const [products, categories, featuredBanners] = await Promise.all([
    fetchPartnerProducts({ page: 1, perPage: 50, includeInactive: true }),
    fetchProductCategoryOptions(),
    fetchFeaturedBannerSchedules(),
  ]);
  return <ProductSection products={products.products} categories={categories} featuredBanners={featuredBanners} />;
}
