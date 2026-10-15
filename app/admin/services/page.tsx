import { ServiceSection } from "@/components/admin/service-section";
import { fetchServiceCategoryOptions, fetchServices } from "@/lib/data/services";

export default async function AdminServicesPage() {
  const [result, categories] = await Promise.all([fetchServices({ includeInactive: true, perPage: 100 }), fetchServiceCategoryOptions()]);
  return <ServiceSection services={result.services} categories={categories} />;
}
