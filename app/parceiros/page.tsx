import { LayoutGrid } from "lucide-react";

import {
  CatalogEmptyState,
  CatalogFilterPanel,
  CatalogHero,
  CatalogPageLayout,
  CatalogResultsHeader,
  type CatalogCategory,
} from "@/components/catalog/catalog-layout";
import { FeaturedCatalogBanner } from "@/components/catalog/featured-catalog-banner";
import { ProductCard } from "@/components/catalog/product-card";
import { ServiceCard } from "@/components/catalog/service-card";
import { PaginationControls } from "@/components/home/pagination-controls";
import { PartnerCard } from "@/components/home/partner-card";
import { fetchCategoryOptions } from "@/lib/data/categories";
import type { PartnerSummary } from "@/lib/data/partners";
import { fetchPartners } from "@/lib/data/partners";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";
import type { PartnerProductSummary } from "@/lib/data/products";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchServiceCategoryOptions, fetchServices } from "@/lib/data/services";
import type { ServiceSummary } from "@/lib/data/services";
import { fetchActiveFeaturedBanners } from "@/lib/data/featured-banners";

type SearchParams = Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
type CatalogKind = "partners" | "products" | "services";
type CatalogType = CatalogKind | "all";

type CatalogEntry =
  | { kind: "partners"; item: PartnerSummary }
  | { kind: "products"; item: PartnerProductSummary }
  | { kind: "services"; item: ServiceSummary };

const CATALOG_PAGE_SIZE = 12;
const CATALOG_FETCH_LIMIT = 1000;

const typeOptions = [
  { value: "all", label: "Todos os itens" },
  { value: "partners", label: "Lojas parceiras" },
  { value: "products", label: "Produtos afiliados" },
  { value: "services", label: "Serviços" },
];

const typeLabels: Record<CatalogKind, string> = {
  partners: "Lojas parceiras",
  products: "Produtos afiliados",
  services: "Serviços",
};

export default async function PartnersDirectoryPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = await resolveSearchParams(searchParams);
  const search = getParam(params.q)?.trim().slice(0, 100) || undefined;
  const type = resolveCatalogType(getParam(params.type));
  const categoryFilter = parseCategoryFilter(getParam(params.category));
  const page = parsePage(getParam(params.page));

  const [partnerCategories, productCategories, serviceCategories, partnerResult, productResult, serviceResult, featuredBanners] = await Promise.all([
    fetchCategoryOptions(),
    fetchProductCategoryOptions(),
    fetchServiceCategoryOptions(),
    fetchPartners({
      page: 1,
      perPage: CATALOG_FETCH_LIMIT,
      search,
      categorySlug: categoryFilter?.kind === "partners" ? categoryFilter.slug : undefined,
    }),
    fetchPartnerProducts({
      page: 1,
      perPage: CATALOG_FETCH_LIMIT,
      search,
      categorySlug: categoryFilter?.kind === "products" ? categoryFilter.slug : undefined,
    }),
    fetchServices({
      page: 1,
      perPage: CATALOG_FETCH_LIMIT,
      search,
      categorySlug: categoryFilter?.kind === "services" ? categoryFilter.slug : undefined,
    }),
    fetchActiveFeaturedBanners(),
  ]);

  const categoryOptions = createCategoryOptions(partnerCategories, productCategories, serviceCategories);
  const selectedCategory = categoryOptions.find((category) => category.slug === getParam(params.category));
  const entries = createCatalogEntries({ type, categoryFilter, partnerResult: partnerResult.partners, productResult: productResult.products, serviceResult: serviceResult.services });
  const totalPages = Math.ceil(entries.length / CATALOG_PAGE_SIZE);
  const pageEntries = entries.slice((page - 1) * CATALOG_PAGE_SIZE, page * CATALOG_PAGE_SIZE);
  const hasFilters = Boolean(search || type !== "all" || categoryFilter);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      {featuredBanners.length ? (
        <FeaturedCatalogBanner banners={featuredBanners} />
      ) : (
        <CatalogHero
          breadcrumb="Parceiros CPAD Belém"
          eyebrow="Parceiros CPAD Belém"
          title="Lojas, produtos"
          highlight="e serviços"
          description="Encontre empresas, produtos afiliados e serviços da comunidade em um único catálogo."
        />
      )}
      <CatalogPageLayout
        sidebar={
          <CatalogFilterPanel
            action="/parceiros"
            title="Explorar catálogo"
            searchLabel="Loja, produto ou serviço"
            searchPlaceholder="Ex.: cozinha, gráfica"
            initialSearch={search}
            typeOptions={typeOptions}
            initialType={type}
            categories={categoryOptions}
            initialCategory={getParam(params.category)}
            categoryLabel="Todas as categorias"
          />
        }
      >
        <CatalogResultsHeader
          eyebrow="Resultados do catálogo"
          title={selectedCategory?.label ?? (type === "all" ? "Resultados" : typeLabels[type])}
          total={entries.length}
          singular="item encontrado"
          plural="itens encontrados"
          search={search}
          hasFilters={hasFilters}
          resetHref="/parceiros"
        />
        {pageEntries.length ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageEntries.map((entry) => <CatalogCard key={`${entry.kind}-${entry.item.id}`} entry={entry} />)}
            </div>
            <div className="mt-9 flex justify-center sm:justify-start">
              <PaginationControls page={page} totalPages={totalPages} buildHref={(nextPage) => buildPageHref({ search, type, category: getParam(params.category), page: nextPage })} />
            </div>
          </>
        ) : (
          <CatalogEmptyState
            icon={LayoutGrid}
            title="Nenhum item encontrado"
            description={hasFilters ? "Tente ajustar os filtros ou limpar a busca para explorar todo o catálogo." : "As lojas, produtos e serviços ativos aparecerão aqui quando forem cadastrados."}
            resetHref={hasFilters ? "/parceiros" : undefined}
            resetLabel="Ver todo o catálogo"
          />
        )}
      </CatalogPageLayout>
    </div>
  );
}

function CatalogCard({ entry }: { entry: CatalogEntry }) {
  switch (entry.kind) {
    case "partners":
      return <PartnerCard partner={entry.item} />;
    case "products":
      return <ProductCard product={entry.item} />;
    case "services":
      return <ServiceCard service={entry.item} />;
  }
}

function createCatalogEntries({
  type,
  categoryFilter,
  partnerResult,
  productResult,
  serviceResult,
}: {
  type: CatalogType;
  categoryFilter: { kind: CatalogKind; slug: string } | null;
  partnerResult: PartnerSummary[];
  productResult: PartnerProductSummary[];
  serviceResult: ServiceSummary[];
}) {
  const canInclude = (kind: CatalogKind) => (type === "all" || type === kind) && (!categoryFilter || categoryFilter.kind === kind);
  const entries: CatalogEntry[] = [
    ...(canInclude("partners") ? partnerResult.map((item) => ({ kind: "partners" as const, item })) : []),
    ...(canInclude("products") ? productResult.map((item) => ({ kind: "products" as const, item })) : []),
    ...(canInclude("services") ? serviceResult.map((item) => ({ kind: "services" as const, item })) : []),
  ];

  return entries.sort((a, b) => b.item.createdAt.getTime() - a.item.createdAt.getTime());
}

function createCategoryOptions(
  partnerCategories: Awaited<ReturnType<typeof fetchCategoryOptions>>,
  productCategories: Awaited<ReturnType<typeof fetchProductCategoryOptions>>,
  serviceCategories: Awaited<ReturnType<typeof fetchServiceCategoryOptions>>,
): CatalogCategory[] {
  return [
    ...partnerCategories.map((category) => ({ id: `partners-${category.id}`, name: category.name, slug: `partners:${category.slug}`, label: `Lojas · ${category.name}` })),
    ...productCategories.map((category) => ({ id: `products-${category.id}`, name: category.name, slug: `products:${category.slug}`, label: `Produtos · ${category.name}` })),
    ...serviceCategories.map((category) => ({ id: `services-${category.id}`, name: category.name, slug: `services:${category.slug}`, label: `Serviços · ${category.name}` })),
  ].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

function buildPageHref({ search, type, category, page }: { search?: string; type: CatalogType; category?: string; page: number }) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (type !== "all") params.set("type", type);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/parceiros?${query}` : "/parceiros";
}

function resolveCatalogType(value?: string) {
  return value === "partners" || value === "products" || value === "services" ? value : "all";
}

function parseCategoryFilter(value?: string): { kind: CatalogKind; slug: string } | null {
  if (!value) return null;
  const [kind, ...slug] = value.split(":");
  if ((kind !== "partners" && kind !== "products" && kind !== "services") || !slug.length) return null;
  return { kind: kind as CatalogKind, slug: slug.join(":") };
}

function parsePage(value?: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function resolveSearchParams(searchParams?: SearchParams): Promise<Record<string, string | string[] | undefined>> {
  if (!searchParams) return {};
  return isPromiseLike(searchParams) ? await searchParams : searchParams;
}

function getParam(value?: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value && typeof (value as Promise<T>).then === "function";
}
