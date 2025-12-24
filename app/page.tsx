import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryFilter } from "@/components/home/category-filter";
import { PartnerCarousel } from "@/components/home/partner-carousel";
import { PaginationControls } from "@/components/home/pagination-controls";
import { ProductHighlight } from "@/components/home/product-highlight";
import { ProductCategoryFilter } from "@/components/home/product-category-filter";
import { DEFAULT_PAGE_SIZE, fetchPartners } from "@/lib/data/partners";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchProductCategoryOptions } from "@/lib/data/product-categories";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await resolveSearchParams(searchParams);
  const categorySlug = extractParam(params.category);
  const page = Math.max(Number(extractParam(params.page)) || 1, 1);

  const productCategory = extractParam(params.productCategory);
  const [partnerResult, categories, productHighlights, productCategories] = await Promise.all([
    fetchPartners({
      categorySlug: categorySlug ?? undefined,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    }),
    fetchCategoryOptions(),
    fetchPartnerProducts({
      page: 1,
      perPage: 6,
      categorySlug: productCategory ?? undefined,
    }),
    fetchProductCategoryOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(partnerResult.total / partnerResult.perPage));

  const buildHref = (pageNumber: number) => {
    const nextParams = new URLSearchParams();
    if (categorySlug) {
      nextParams.set("category", categorySlug);
    }
    nextParams.set("page", pageNumber.toString());
    const query = nextParams.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-[32px] border border-[#b02a20]/20 bg-[#b02a20] text-white shadow-[0_30px_80px_rgba(140,31,24,0.25)]">
        <div className="grid gap-8 p-8 sm:grid-cols-[1.3fr_1fr] sm:p-10 lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              Rede oficial
              <ShieldCheck className="h-4 w-4" />
              CPAD Belém
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Descubra parceiros confiáveis e produtos oficiais com a curadoria CPAD Belém
            </h1>
            <p className="max-w-2xl text-lg text-white/85">
              Um hub seguro de lojas, serviços e itens aprovados pelo nosso time. Tudo em um
              layout inspirado na experiência de vitrine da Netflix.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-[#8c1f18]/30">
                <Link href="#categorias">Explorar parceiros</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#produtos">Ver produtos oficiais</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="gap-2 border-white/20 text-white">
                <Link href="https://cpadbelem.com.br/" target="_blank">
                  Loja virtual
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: partnerResult.total, label: "parceiros verificados" },
                { value: categories.length, label: "categorias ativas" },
                { value: "100%", label: "links seguros" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/80"
                >
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[28px] bg-white/10 blur-xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-[#fff4ee]/95 p-6 text-[#2d1c16] shadow-[0_20px_80px_rgba(45,28,22,0.25)]">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#9a231a]">
                Curadoria CPAD
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="mt-3 text-2xl font-semibold leading-tight">
                A vitrine segura para indicar a clientes e igrejas
              </h2>
              <p className="mt-2 text-sm text-neutral-700">
                Parceiros verificados, produtos acompanhados e métricas para o time interno. Tudo
                alinhado à identidade CPAD.
              </p>
              <div className="mt-5 grid gap-3 rounded-2xl bg-white p-3">
                <FeaturePill text="Links rastreados com registro de cliques" />
                <FeaturePill text="Catálogo em fileiras horizontais estilo streaming" />
                <FeaturePill text="Área admin com visão geral e cadastros rápidos" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                <Badge className="bg-[#fff0e6] text-[#9a231a]">Marketplace seguro</Badge>
                <Badge variant="outline" className="text-[#9a231a]">
                  Loja virtual CPAD
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HighlightSection
        id="categorias"
        subtitle="rede viva"
        title="Parceiros em fileiras, estilo Netflix"
        filter={<CategoryFilter categories={categories} />}
        stats={[
          { value: partnerResult.total, label: "Lojas homologadas" },
          { value: categories.length, label: "Categorias ativas" },
          { value: "Anti-golpe", label: "Verificação humana" },
        ]}
      >
        <PartnerCarousel partners={partnerResult.partners} />
        <div className="flex flex-col items-center gap-4 pt-4">
          <PaginationControls page={page} totalPages={totalPages} buildHref={buildHref} />
          <p className="text-sm text-neutral-600">
            Página {page} de {totalPages} — até {DEFAULT_PAGE_SIZE} parceiros por listagem.
          </p>
        </div>
      </HighlightSection>

      <HighlightSection
        id="produtos"
        subtitle="vitrine afiliada"
        title="Produtos oficiais e ofertas recomendadas"
        filter={<ProductCategoryFilter categories={productCategories} />}
        stats={[
          { value: productHighlights.total, label: "Produtos ativos" },
          { value: productCategories.length, label: "Categorias" },
          { value: "Links seguros", label: "Acompanhados pela equipe" },
        ]}
      >
        <ProductHighlight products={productHighlights.products} />
      </HighlightSection>

      <section className="grid gap-6 rounded-[28px] border border-black/5 bg-white/70 p-8 shadow-[0_24px_70px_rgba(45,28,22,0.08)] md:grid-cols-3">
        {[
          {
            title: "Validação transparente",
            text: "CNPJ, histórico e plataforma checados antes de qualquer vitrine. Sem links duvidosos.",
          },
          {
            title: "Curadoria CPAD",
            text: "Equipe conversa com cada lojista e acompanha atendimento. Alinhado a valores da CPAD.",
          },
          {
            title: "Apoio contínuo",
            text: "O admin publica logos, fotos, links e novidades direto do painel seguro com login Google.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-[#b02a20]/10 bg-[#fff4ee] p-6 text-[#2d1c16] shadow-[0_16px_40px_rgba(45,28,22,0.08)]"
          >
            <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-neutral-700">{feature.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

type HighlightSectionProps = {
  id: string;
  subtitle: string;
  title: string;
  filter: ReactNode;
  stats: Array<{ value: string | number; label: string }>;
  children: ReactNode;
};

function HighlightSection({ id, subtitle, title, filter, stats, children }: HighlightSectionProps) {
  return (
    <section
      id={id}
      className="space-y-8 rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-[0_24px_70px_rgba(45,28,22,0.08)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#b02a20]/80">{subtitle}</p>
          <h2 className="text-3xl font-semibold text-[#2d1c16]">{title}</h2>
        </div>
        <div className="w-full max-w-xs">{filter}</div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-2xl border border-dashed border-[#b02a20]/15 bg-[#fff4ee] p-4 text-sm text-neutral-700">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white px-4 py-3 shadow-sm shadow-[#8c1f18]/5">
            <p className="text-2xl font-bold text-[#b02a20]">{stat.value}</p>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {children}
    </section>
  );
}

function FeaturePill({ text }: { text: string }) {
  return (
    <span className="inline-flex w-full items-center gap-2 rounded-full border border-[#b02a20]/15 bg-white px-3 py-2 text-sm text-[#2d1c16] shadow-sm sm:w-auto">
      <Sparkles className="h-4 w-4 text-[#b02a20]" />
      {text}
    </span>
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
