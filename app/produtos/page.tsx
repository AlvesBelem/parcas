import { ShoppingBag } from "lucide-react";

import {
  CatalogEmptyState,
  CatalogFilterPanel,
  CatalogHero,
  CatalogPageLayout,
  CatalogResultsHeader,
} from "@/components/catalog/catalog-layout";
import { ProductCard } from "@/components/catalog/product-card";
import { PaginationControls } from "@/components/home/pagination-controls";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchActiveFeaturedBanners, getFeaturedTargetIds, prioritizeFeatured } from "@/lib/data/featured-banners";

type SearchParams = Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
const PRODUCTS_PER_PAGE = 50;
const CATALOG_FETCH_LIMIT = 1000;

export default async function ProductsCatalogPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = await resolveSearchParams(searchParams);
  const categorySlug = (getParam(params.category) ?? getParam(params.productCategory))?.trim() || undefined;
  const search = getParam(params.q)?.trim().slice(0, 100) || undefined;
  const page = parsePage(getParam(params.page));
  const [categories, result, featuredBanners] = await Promise.all([
    fetchProductCategoryOptions(),
    fetchPartnerProducts({ page: 1, perPage: CATALOG_FETCH_LIMIT, categorySlug, search }),
    fetchActiveFeaturedBanners(),
  ]);
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const featuredProductIds = getFeaturedTargetIds(featuredBanners, "PRODUCT");
  const products = prioritizeFeatured(result.products, featuredProductIds);
  const totalPages = Math.ceil(result.total / PRODUCTS_PER_PAGE);
  const pageProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
  const hasFilters = Boolean(categorySlug || search);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <CatalogHero
        breadcrumb="Produtos"
        eyebrow="Catálogo afiliado"
        title="Produtos"
        highlight="afiliados"
        description="Encontre itens por categoria e compre diretamente no marketplace informado em cada publicação."
      />
      <CatalogPageLayout
        sidebar={
          <CatalogFilterPanel
            action="/produtos"
            title="Buscar produtos"
            searchLabel="Nome, categoria ou marketplace"
            searchPlaceholder="Ex.: brinquedos"
            initialSearch={search}
            categories={categories}
            initialCategory={categorySlug}
            categoryLabel="Todas as categorias"
          />
        }
      >
        <CatalogResultsHeader
          eyebrow="Resultados"
          title={selectedCategory?.name ?? "Todos os produtos"}
          total={result.total}
          singular="produto encontrado"
          plural="produtos encontrados"
          search={search}
          hasFilters={hasFilters}
          resetHref="/produtos"
        />
        {result.products.length ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageProducts.map((product) => <ProductCard key={product.id} product={product} featured={featuredProductIds.has(product.id)} />)}
            </div>
            <div className="mt-9 flex justify-center sm:justify-start">
              <PaginationControls page={page} totalPages={totalPages} buildHref={(nextPage) => buildPageHref({ categorySlug, search, page: nextPage })} />
            </div>
          </>
        ) : (
          <CatalogEmptyState
            icon={ShoppingBag}
            title="Nenhum produto encontrado"
            description={hasFilters ? "Tente ajustar a busca ou selecionar outra categoria." : "Os itens afiliados ativos aparecerão aqui quando forem cadastrados."}
            resetHref={hasFilters ? "/produtos" : undefined}
            resetLabel="Ver todos os produtos"
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
  return query ? `/produtos?${query}` : "/produtos";
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
