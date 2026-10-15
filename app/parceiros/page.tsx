import Link from "next/link";
import { Filter, Search, X } from "lucide-react";

import { PaginationControls } from "@/components/home/pagination-controls";
import { PartnerCard } from "@/components/home/partner-card";
import { Button } from "@/components/ui/button";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { DEFAULT_PAGE_SIZE, fetchPartners } from "@/lib/data/partners";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

export default async function PartnersDirectoryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await resolveSearchParams(searchParams);
  const categorySlug = extractParam(params.category)?.trim() || undefined;
  const search = extractParam(params.q)?.trim().slice(0, 100) || undefined;
  const page = parsePage(extractParam(params.page));
  const [categories, partnerResult] = await Promise.all([
    fetchCategoryOptions(),
    fetchPartners({ categorySlug, search, page, perPage: DEFAULT_PAGE_SIZE }),
  ]);
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const totalPages = Math.ceil(partnerResult.total / DEFAULT_PAGE_SIZE);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <section className="relative overflow-hidden bg-[var(--color-wine-dark)] px-4 py-11 text-white sm:px-6 lg:px-8 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(241,199,125,0.34),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_55%,transparent_56%)]" />
        <div className="relative mx-auto max-w-[1280px]">
          <nav className="text-sm text-white/65" aria-label="Navegação estrutural">
            <Link href="/" className="hover:text-white">Início</Link><span className="px-2">/</span><span>Lojas parceiras</span>
          </nav>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold-light)]">Diretório CPAD Belém</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-5xl leading-none sm:text-6xl">Lojas <span className="text-[var(--color-gold-light)]">Parceiras</span></h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            Descubra empresas e empreendedores com presença no diretório de parceiros CPAD Belém.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-12">
        <DirectoryFilters categories={categories} initialCategory={categorySlug} initialSearch={search} />

        <div className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Resultados</p>
              <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)] sm:text-4xl">
                {selectedCategory ? selectedCategory.name : "Todas as lojas parceiras"}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]" aria-live="polite">
                {partnerResult.total} {partnerResult.total === 1 ? "loja encontrada" : "lojas encontradas"}
                {search ? ` para “${search}”` : ""}.
              </p>
            </div>
            {(categorySlug || search) && (
              <Link
                href="/parceiros"
                className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-wine-dark)] sm:self-auto"
              >
                <X className="h-4 w-4" aria-hidden /> Limpar filtros
              </Link>
            )}
          </div>

          {partnerResult.partners.length ? (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {partnerResult.partners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} compact />
                ))}
              </div>
              <div className="mt-9 flex justify-center sm:justify-start">
                <PaginationControls page={partnerResult.page} totalPages={totalPages} buildHref={(nextPage) => buildPageHref({ categorySlug, search, page: nextPage })} />
              </div>
            </>
          ) : (
            <EmptyDirectory hasFilters={Boolean(categorySlug || search)} />
          )}
        </div>
      </section>
    </div>
  );
}

function DirectoryFilters({
  categories,
  initialCategory,
  initialSearch,
}: {
  categories: Awaited<ReturnType<typeof fetchCategoryOptions>>;
  initialCategory?: string;
  initialSearch?: string;
}) {
  return (
    <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-6" aria-label="Filtros do diretório">
      <div className="flex items-center gap-2 text-[var(--color-text)]">
        <Filter className="h-5 w-5 text-[var(--color-wine)]" aria-hidden />
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl">Buscar parceiros</h2>
      </div>
      <form action="/parceiros" className="mt-5 space-y-6">
        <div>
          <label htmlFor="directory-search" className="text-sm font-bold text-[var(--color-text)]">Nome, categoria ou serviço</label>
          <div className="mt-2 flex border border-[var(--color-border-strong)] bg-white focus-within:ring-2 focus-within:ring-[var(--color-focus)]">
            <input
              id="directory-search"
              name="q"
              type="search"
              defaultValue={initialSearch}
              placeholder="Ex.: presentes"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
            />
            <span className="flex w-10 items-center justify-center text-[var(--color-wine)]"><Search className="h-4 w-4" aria-hidden /></span>
          </div>
        </div>

        <div>
          <label htmlFor="directory-category" className="text-sm font-bold text-[var(--color-text)]">Categoria</label>
          <select
            id="directory-category"
            name="category"
            defaultValue={initialCategory ?? ""}
            className="mt-2 h-11 w-full border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full"><Filter className="h-4 w-4" aria-hidden /> Aplicar filtros</Button>
      </form>
    </aside>
  );
}

function EmptyDirectory({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="mt-6 border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-center sm:p-12">
      <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Nenhuma loja encontrada</h3>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {hasFilters ? "Tente ajustar sua busca ou limpar os filtros." : "O diretório ainda não possui lojas publicadas."}
      </p>
      {hasFilters && <Button asChild variant="secondary" className="mt-5"><Link href="/parceiros">Ver todas as lojas</Link></Button>}
    </div>
  );
}

function buildPageHref({
  categorySlug,
  search,
  page,
}: {
  categorySlug?: string;
  search?: string;
  page: number;
}) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (search) params.set("q", search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/parceiros?${query}` : "/parceiros";
}

function parsePage(value?: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function resolveSearchParams(
  searchParams?: SearchParams,
): Promise<Record<string, string | string[] | undefined>> {
  if (!searchParams) return {};
  if (isPromiseLike(searchParams)) return await searchParams;
  return searchParams;
}

function extractParam(value?: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value && typeof (value as Promise<T>).then === "function";
}
