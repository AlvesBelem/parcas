import type { Metadata } from "next";
import { Wrench } from "lucide-react";

import {
  CatalogEmptyState,
  CatalogFilterPanel,
  CatalogHero,
  CatalogPageLayout,
  CatalogResultsHeader,
} from "@/components/catalog/catalog-layout";
import { ServiceCard } from "@/components/catalog/service-card";
import { PaginationControls } from "@/components/home/pagination-controls";
import { fetchServiceCategoryOptions, fetchServices } from "@/lib/data/services";
import { fetchActiveFeaturedBanners, getFeaturedTargetIds, prioritizeFeatured } from "@/lib/data/featured-banners";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type SearchParams = Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
const SERVICES_PER_PAGE = 50;
const CATALOG_FETCH_LIMIT = 1000;

export async function generateMetadata({ searchParams }: { searchParams?: SearchParams }): Promise<Metadata> {
  const params = await resolveSearchParams(searchParams);
  const hasQueryVariant = Boolean(getParam(params.q) || getParam(params.category) || parsePage(getParam(params.page)) > 1);

  return {
    title: "Serviços parceiros",
    description: "Encontre profissionais e empresas de serviços parceiros da CPAD Belém por categoria e canal de atendimento.",
    alternates: { canonical: "/servicos" },
    robots: { index: !hasQueryVariant, follow: true },
    openGraph: {
      type: "website",
      url: absoluteUrl("/servicos"),
      title: "Serviços parceiros | CPAD Belém",
      description: "Profissionais e empresas de serviços parceiros da CPAD Belém.",
      images: [{ url: absoluteUrl(siteConfig.socialImagePath), alt: "Serviços parceiros CPAD Belém" }],
    },
  };
}

export default async function ServicesPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = await resolveSearchParams(searchParams);
  const categorySlug = getParam(params.category)?.trim() || undefined;
  const search = getParam(params.q)?.trim().slice(0, 100) || undefined;
  const page = parsePage(getParam(params.page));
  const [categories, result, featuredBanners] = await Promise.all([
    fetchServiceCategoryOptions(),
    fetchServices({ categorySlug, search, page: 1, perPage: CATALOG_FETCH_LIMIT }),
    fetchActiveFeaturedBanners(),
  ]);
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const hasFilters = Boolean(categorySlug || search);
  const totalPages = Math.ceil(result.total / SERVICES_PER_PAGE);
  const featuredServiceIds = getFeaturedTargetIds(featuredBanners, "SERVICE");
  const services = prioritizeFeatured(result.services, featuredServiceIds);
  const pageServices = services.slice((page - 1) * SERVICES_PER_PAGE, page * SERVICES_PER_PAGE);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <CatalogHero
        breadcrumb="Serviços"
        eyebrow="Catálogo de atendimento"
        title="Serviços"
        highlight="parceiros"
        description="Encontre profissionais e empresas por categoria e fale diretamente pelo canal informado."
      />
      <CatalogPageLayout
        sidebar={
          <CatalogFilterPanel
            action="/servicos"
            title="Buscar serviços"
            searchLabel="Nome, categoria ou atendimento"
            searchPlaceholder="Ex.: consultoria"
            initialSearch={search}
            categories={categories}
            initialCategory={categorySlug}
            categoryLabel="Todas as categorias"
          />
        }
      >
        <CatalogResultsHeader
          eyebrow="Resultados"
          title={selectedCategory?.name ?? "Todos os serviços"}
          total={result.total}
          singular="serviço encontrado"
          plural="serviços encontrados"
          search={search}
          hasFilters={hasFilters}
          resetHref="/servicos"
        />
        {result.services.length ? (
          <>
            <div className="mx-1.5 mt-6 grid gap-5 sm:mx-0 sm:grid-cols-2 xl:grid-cols-3">
              {pageServices.map((service) => <ServiceCard key={service.id} service={service} featured={featuredServiceIds.has(service.id)} />)}
            </div>
            <div className="mt-9 flex justify-center sm:justify-start">
              <PaginationControls page={page} totalPages={totalPages} buildHref={(nextPage) => buildPageHref({ categorySlug, search, page: nextPage })} />
            </div>
          </>
        ) : (
          <CatalogEmptyState
            icon={Wrench}
            title="Nenhum serviço encontrado"
            description={hasFilters ? "Tente ajustar a busca ou selecionar outra categoria." : "Os serviços ativos aparecerão aqui quando forem cadastrados."}
            resetHref={hasFilters ? "/servicos" : undefined}
            resetLabel="Ver todos os serviços"
          />
        )}
      </CatalogPageLayout>
    </div>
  );
}

function buildPageHref({ categorySlug, search, page }: { categorySlug?: string; search?: string; page: number }) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (search) params.set("q", search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/servicos?${query}` : "/servicos";
}

function parsePage(value?: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function resolveSearchParams(searchParams?: SearchParams) {
  return searchParams && "then" in searchParams ? await searchParams : searchParams ?? {};
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
