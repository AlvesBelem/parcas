import Link from "next/link";

import { ProductHighlight } from "@/components/home/product-highlight";
import { ProductCategoryFilter } from "@/components/home/product-category-filter";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";

const PAGE_SIZE = 9;

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await resolveSearchParams(searchParams);
  const page = Math.max(Number(extractParam(params.page)) || 1, 1);
  const categorySlug = extractParam(params.category);

  const [productsResult, categories] = await Promise.all([
    fetchPartnerProducts({
      page,
      perPage: PAGE_SIZE,
      categorySlug: categorySlug ?? undefined,
    }),
    fetchProductCategoryOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(productsResult.total / PAGE_SIZE));

  const buildHref = (pageNumber: number) => {
    const nextParams = new URLSearchParams();
    if (categorySlug) {
      nextParams.set("category", categorySlug);
    }
    nextParams.set("page", pageNumber.toString());
    const query = nextParams.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3 rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
        <p className="text-xs uppercase tracking-[0.32em] text-[#b02a20]">Produtos oficiais</p>
        <h1 className="text-3xl font-semibold text-[#2d1c16]">Ofertas recomendadas pela CPAD Belém</h1>
        <p className="text-sm text-neutral-600">
          Veja os itens indicados e acompanhe ofertas seguras em parceiros confiáveis.
        </p>
      </header>

      <section className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-[#b02a20]/80">Filtrar</p>
            <h2 className="text-xl font-semibold text-[#2d1c16]">Escolha uma categoria</h2>
          </div>
          <div className="w-full max-w-xs">
            <ProductCategoryFilter categories={categories} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 rounded-2xl border border-dashed border-[#b02a20]/15 bg-[#fff4ee] p-4 text-sm text-neutral-700">
          <Stat value={productsResult.total} label="Produtos ativos" />
          <Stat value={categories.length} label="Categorias" />
          <Stat value="Links seguros" label="Monitorados pela equipe" />
        </div>

        <ProductHighlight products={productsResult.products} />

        <div className="flex flex-col items-center gap-4 pt-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            buildHref={buildHref}
          />
          <p className="text-sm text-neutral-600">
            Página {page} de {totalPages} — até {PAGE_SIZE} produtos por listagem.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#b02a20]/10 bg-[#fff4ee] px-4 py-3 text-sm text-[#2d1c16]">
        <span className="font-semibold">Quer publicar um novo produto?</span>
        <Link href="/admin/products" className="underline underline-offset-4 text-[#b02a20]">
          Abrir painel admin
        </Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm shadow-[#8c1f18]/5">
      <p className="text-2xl font-bold text-[#b02a20]">{value}</p>
      <p className="text-sm text-neutral-600">{label}</p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages: Array<number | string> = [];
  const delta = 2;
  const start = Math.max(2, page - delta);
  const end = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pages.map((item, idx) =>
        typeof item === "number" ? (
          <Link
            key={item}
            href={buildHref(item)}
            className={`h-9 w-9 rounded-full border text-center text-sm leading-9 ${
              item === page
                ? "border-[#b02a20]/60 bg-[#fff0e6] text-[#b02a20] font-semibold"
                : "border-black/10 text-neutral-700"
            }`}
          >
            {item}
          </Link>
        ) : (
          <span key={`${item}-${idx}`} className="px-1 text-neutral-500">
            {item}
          </span>
        ),
      )}
    </div>
  );
}

async function resolveSearchParams(
  searchParams?: SearchParams,
): Promise<Record<string, string | string[] | undefined>> {
  if (!searchParams) return {};
  if (isPromiseLike(searchParams)) {
    return await searchParams;
  }
  return searchParams;
}

function extractParam(value?: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? null;
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as Promise<T>).then === "function"
  );
}
