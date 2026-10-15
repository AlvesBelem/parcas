import { ServiceSection } from "@/components/admin/service-section";
import { fetchServiceCategoryOptions, fetchServices } from "@/lib/data/services";
import { fetchFeaturedBannerSchedules } from "@/lib/data/featured-banners";

export default async function AdminServicesPage() {
  const [result, categories, featuredBanners] = await Promise.all([fetchServices({ includeInactive: true, perPage: 100 }), fetchServiceCategoryOptions(), fetchFeaturedBannerSchedules()]);
  return <ServiceSection services={result.services} categories={categories} featuredBanners={featuredBanners} />;
}
