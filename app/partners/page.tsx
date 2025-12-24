import Link from "next/link";

import { CategoryFilter } from "@/components/home/category-filter";
import { PartnerCarousel } from "@/components/home/partner-carousel";
import { PaginationControls } from "@/components/home/pagination-controls";
import { DEFAULT_PAGE_SIZE, fetchPartners } from "@/lib/data/partners";
import { fetchCategoryOptions } from "@/lib/data/categories";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

export default async function PartnersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await resolveSearchParams(searchParams);
  const categorySlug = extractParam(params.category);
  const page = Math.max(Number(extractParam(params.page)) || 1, 1);

  const [partnerResult, categories] = await Promise.all([
    fetchPartners({
      categorySlug: categorySlug ?? undefined,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    }),
    fetchCategoryOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(partnerResult.total / partnerResult.perPage));

  const buildHref = (pageNumber: number) => {
    const nextParams = new URLSearchParams();
    if (categorySlug) {
      nextParams.set("category", categorySlug);
    }
    nextParams.set("page", pageNumber.toString());
    const query = nextParams.toString();
    return query ? `/partners?${query}` : "/partners";
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3 rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
        <p className="text-xs uppercase tracking-[0.32em] text-[#b02a20]">Parceiros oficiais</p>
        <h1 className="text-3xl font-semibold text-[#2d1c16]">Lista de parceiros homologados</h1>
        <p className="text-sm text-neutral-600">
          Acesse a vitrine completa de parceiros confiáveis. Cada link é verificado e monitorado pela
          equipe CPAD Belém.
        </p>
      </header>

      <section className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-[#b02a20]/80">Filtrar</p>
            <h2 className="text-xl font-semibold text-[#2d1c16]">Escolha uma categoria</h2>
          </div>
          <div className="w-full max-w-xs">
            <CategoryFilter categories={categories} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 rounded-2xl border border-dashed border-[#b02a20]/15 bg-[#fff4ee] p-4 text-sm text-neutral-700">
          <Stat value={partnerResult.total} label="Lojas homologadas" />
          <Stat value={categories.length} label="Categorias ativas" />
          <Stat value="Links seguros" label="Monitorados pela equipe" />
        </div>

        <PartnerCarousel partners={partnerResult.partners} />

        <div className="flex flex-col items-center gap-4 pt-2">
          <PaginationControls page={page} totalPages={totalPages} buildHref={buildHref} />
          <p className="text-sm text-neutral-600">
            Página {page} de {totalPages} — até {DEFAULT_PAGE_SIZE} parceiros por listagem.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#b02a20]/10 bg-[#fff4ee] px-4 py-3 text-sm text-[#2d1c16]">
        <span className="font-semibold">Quer cadastrar um novo parceiro?</span>
        <Link href="/admin/partners" className="underline underline-offset-4 text-[#b02a20]">
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
