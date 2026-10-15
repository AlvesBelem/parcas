import { fetchPartners } from "@/lib/data/partners";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { PartnerSection } from "@/components/admin/partner-section";
import { fetchFeaturedBannerSchedules } from "@/lib/data/featured-banners";

export default async function AdminPartnersPage() {
  const [partnerResult, categories, featuredBanners] = await Promise.all([
    fetchPartners({ page: 1, perPage: 50, includeInactive: true }),
    fetchCategoryOptions(),
    fetchFeaturedBannerSchedules(),
  ]);

  return (
    <PartnerSection
      partners={partnerResult.partners}
      categories={categories}
      featuredBanners={featuredBanners}
    />
  );
}
