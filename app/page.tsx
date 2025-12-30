import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, TicketPercent, Truck } from "lucide-react";

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
    <div className="space-y-12 sm:space-y-16">
      <section
        id="rede"
        className="overflow-hidden rounded-3xl bg-[#b02b24] text-white shadow-[0_25px_80px_rgba(63,33,25,0.25)]"
      >
        <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="space-y-5">
            <Badge className="bg-white/15 text-white" variant="default">
              Rede oficial CPAD Belém
            </Badge>
            <h1
              className="text-4xl font-semibold leading-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Bem-vindo ao programa de parceiros e produtos CPAD Belém
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Conectamos você com lojas confiáveis e ofertas oficiais, seguindo a mesma
              identidade do nosso site principal. Tudo aqui é verificado, acompanhado e preparado
              para uma experiência tranquila.
            </p>
            <div className="flex flex-wrap gap-3">
              <FeaturePill icon={ShieldCheck} text="Cliques rastreados e seguros" />
              <FeaturePill icon={Truck} text="Entrega acompanhada pelo time local" />
              <FeaturePill icon={TicketPercent} text="Ofertas destacadas e sem golpes" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="w-full bg-white text-[#b02b24] hover:bg-[#fff4f0] sm:w-auto"
              >
                <Link href="#categorias">Explorar parceiros</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full border border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                <Link href="#produtos">Ver produtos oficiais</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/80">Nossa loja</p>
                  <p className="text-lg font-semibold">CPAD Belém</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Image
                    src="/LOGO_VETOR_CPAD_FOGO.svg"
                    alt="Logomarca CPAD Belém"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <StatPill label="Lojas ativas" value={partnerResult.total} />
                <StatPill label="Categorias" value={categories.length} />
                <StatPill label="Produtos oficiais" value={productHighlights.total} />
                <StatPill label="Cliques rastreados" value="100%" />
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-relaxed text-white/90">
                <p className="font-semibold">Vitrine alinhada ao site CPAD Belém.</p>
                <p>Layout claro, filtros rápidos e destaque para lançamentos e promoções.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HighlightSection
        id="categorias"
        subtitle="Rede viva"
        title="Parceiros em destaque"
        filter={<CategoryFilter categories={categories} />}
        stats={[
          { value: partnerResult.total, label: "Lojas homologadas" },
          { value: categories.length, label: "Categorias ativas" },
          { value: "Monitorados", label: "Links auditados" },
        ]}
      >
        <PartnerCarousel partners={partnerResult.partners} />
        <div className="flex flex-col items-center gap-4 pt-4">
          <PaginationControls page={page} totalPages={totalPages} buildHref={buildHref} />
          <p className="text-sm text-[#856553]">
            Página {page} de {totalPages} — exibindo até {DEFAULT_PAGE_SIZE} parceiros.
          </p>
        </div>
      </HighlightSection>

      <HighlightSection
        id="produtos"
        subtitle="Ofertas oficiais"
        title="Produtos com a cara da CPAD"
        filter={<ProductCategoryFilter categories={productCategories} />}
        stats={[
          { value: productHighlights.total, label: "Produtos ativos" },
          { value: productCategories.length, label: "Categorias" },
          { value: "100%", label: "Redirecionamento seguro" },
        ]}
      >
        <ProductHighlight products={productHighlights.products} />
      </HighlightSection>

      <section className="grid gap-6 rounded-3xl border border-[#eaded5] bg-white p-6 shadow-[0_15px_45px_rgba(63,33,25,0.08)] md:grid-cols-3">
        {[
          {
            title: "Validação transparente",
            text: "Conferimos CNPJ, atendimento e plataforma antes de liberar qualquer vitrine.",
          },
          {
            title: "Curadoria humana",
            text: "Conversamos com cada lojista e mantemos o contato próximo com o time CPAD Belém.",
          },
          {
            title: "Painel prático",
            text: "O admin publica fotos, links e novidades direto do painel seguro com login Google.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-[#f1e5dc] bg-[#fff8f3] p-5 text-[#3f2b22] shadow-[0_10px_30px_rgba(63,33,25,0.05)]"
          >
            <h3 className="mb-2 text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
              {feature.title}
            </h3>
            <p className="text-sm text-[#7a5a4b]">{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#eaded5] bg-white px-6 py-8 shadow-[0_15px_45px_rgba(63,33,25,0.08)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 text-center sm:text-left lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#b02b24]">Novidades e avisos</p>
            <h2 className="text-2xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
              Receba promoções e alertas de parceiros
            </h2>
            <p className="text-sm text-[#7a5a4b]">
              Cadastre-se para receber novidades alinhadas ao site principal e às campanhas vigentes.
            </p>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="h-12 w-full rounded-2xl border border-[#eaded5] px-4 text-sm shadow-[0_8px_25px_rgba(63,33,25,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1b4aa]"
            />
            <Button className="h-12 sm:w-40">Quero receber</Button>
          </div>
        </div>
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

function HighlightSection({
  id,
  subtitle,
  title,
  filter,
  stats,
  children,
}: HighlightSectionProps) {
  return (
    <section
      id={id}
      className="space-y-8 rounded-3xl border border-[#eaded5] bg-white p-6 shadow-[0_15px_45px_rgba(63,33,25,0.08)] sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#b02b24]">{subtitle}</p>
          <h2
            className="text-3xl font-semibold text-[#2f1d15]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h2>
        </div>
        <div className="w-full max-w-xs">{filter}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#f3e7de] bg-[#fff8f3] px-4 py-3 text-sm text-[#7a5a4b] shadow-[0_8px_25px_rgba(63,33,25,0.05)]"
          >
            <p className="text-2xl font-semibold text-[#b02b24]">{stat.value}</p>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      {children}
    </section>
  );
}

function FeaturePill({
  text,
  icon: Icon,
}: {
  text: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
      {Icon ? <Icon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      {text}
    </span>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/25 bg-white/10 p-3 text-center text-white">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-wide text-white/80">{label}</p>
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
