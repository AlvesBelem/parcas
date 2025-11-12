import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";
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

  const totalPages = Math.max(
    1,
    Math.ceil(partnerResult.total / partnerResult.perPage),
  );

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
    <div className="space-y-14">
      <section
        id="rede"
        className="space-y-8 rounded-3xl border border-white/10 bg-linear-to-br from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl shadow-black/30 sm:p-10 sm:text-left"
      >
        <div className="flex items-center justify-center">
          <Image
            src="/logo_cpad_belem.svg"
            alt="Logomarca CPAD Belem"
            width={180}
            height={180}
            priority
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        <div className="flex flex-col gap-6">
          <Badge variant="outline" className="mx-auto w-fit sm:mx-0">
            Rede oficial de parceiros e produtos CPAD Belém
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Bem-vindo ao Programa de Parcerias e Produtos da CPAD Belém
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-white/70 sm:mx-0 sm:text-left">
            Aqui reunimos lojistas amigos e também produtos afiliados que conhecemos de perto.
            Tudo passa pela curadoria da CPAD Belém para garantir compras seguras, suporte humano
            e transparência em cada recomendação.
          </p>


          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70 sm:justify-start">
            <FeaturePill text="Documentados, testados e aprovados" />
            <FeaturePill text="Entrega garantida pelo time CPAD Belém" />
            <FeaturePill text="Produtos e lojistas com suporte direto" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#categorias">Explorar parceiros</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="#produtos">Ver produtos oficiais</Link>
            </Button>
          </div>
        </div>
      </section>

      <HighlightSection
        id="categorias"
        subtitle="rede viva"
        title="Parceiros em destaque"
        filter={<CategoryFilter categories={categories} />}
        stats={[
          { value: partnerResult.total, label: "Lojas homologadas" },
          { value: categories.length, label: "Categorias ativas" },
          { value: "100%", label: "Anti-golpe comprovado" },
        ]}
      >
        <PartnerCarousel partners={partnerResult.partners} />
        <div className="flex flex-col items-center gap-4 pt-4">
          <PaginationControls
            page={page}
            totalPages={totalPages}
            buildHref={buildHref}
          />
          <p className="text-sm text-white/50">
            Pagina {page} de {totalPages} - exibindo ate {DEFAULT_PAGE_SIZE} parceiros por vez.
          </p>
        </div>
      </HighlightSection>

      <HighlightSection
        id="produtos"
        subtitle="produtos em destaque"
        title="Ofertas oficiais dos parceiros"
        filter={<ProductCategoryFilter categories={productCategories} />}
        stats={[
          { value: productHighlights.total, label: "Produtos ativos" },
          { value: productCategories.length, label: "Categorias de produtos" },
          { value: "100%", label: "Links confiaveis" },
        ]}
      >
        <ProductHighlight products={productHighlights.products} />
      </HighlightSection>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:grid-cols-3">
        {[
          {
            title: "Validacao transparente",
            text: "Verificamos CNPJ, historico de atendimento e a plataforma de cada produto antes de liberar qualquer vitrine.",
          },
          {
            title: "Curadoria com carinho",
            text: "Nossa equipe conversa com cada lojista e garante que ele compartilhe dos nossos valores.",
          },
          {
            title: "Apoio ao lojista e produtor",
            text: "O admin publica fotos, links e novidades de lojas e produtos direto do painel seguro com login Google.",
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-white/5 bg-white/5 p-6 text-white/80"
          >
            <h3 className="mb-3 text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p>{feature.text}</p>
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
      className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-white"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">{subtitle}</p>
          <h2 className="text-3xl font-semibold">{title}</h2>
        </div>
        <div className="w-full max-w-xs">{filter}</div>
      </div>

      <div className="flex flex-wrap gap-6 rounded-3xl border border-dashed border-white/20 bg-black/30 p-6 text-sm text-white/70">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      {children}
    </section>
  );
}

function FeaturePill({ text }: { text: string }) {
  return (
    <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 sm:w-auto sm:justify-start">
      <Sparkles className="h-4 w-4 text-lime-200" />
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
