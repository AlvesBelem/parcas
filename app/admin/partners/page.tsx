import { fetchPartners } from "@/lib/data/partners";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { PartnerSection } from "@/components/admin/partner-section";

export default async function AdminPartnersPage() {
  const [partnerResult, categories] = await Promise.all([
    fetchPartners({ page: 1, perPage: 50, includeInactive: true }),
    fetchCategoryOptions(),
  ]);

  return (
    <PartnerSection
      partners={partnerResult.partners}
      categories={categories}
    />
  );
}
