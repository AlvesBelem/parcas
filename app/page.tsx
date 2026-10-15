import Link from "next/link";
import { ArrowRight, BarChart3, Gem, UsersRound } from "lucide-react";

import { CategoryExplorer } from "@/components/home/category-explorer";
import { MarketplaceHero } from "@/components/home/marketplace-hero";
import { PartnerCard } from "@/components/home/partner-card";
import { Button } from "@/components/ui/button";
import { fetchCategoryOptions } from "@/lib/data/categories";
import { fetchPartners } from "@/lib/data/partners";

const FEATURED_PARTNERS = 6;

export const revalidate = 300;

export default async function Home() {
  const [partnersResult, categories] = await Promise.all([
    fetchPartners({ page: 1, perPage: FEATURED_PARTNERS }),
    fetchCategoryOptions(),
  ]);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <MarketplaceHero partnerCount={partnersResult.total} categoryCount={categories.length} />
      <CategoryExplorer categories={categories} />

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20" aria-labelledby="featured-title">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Escolhas para conhecer</p>
            <h2 id="featured-title" className="mt-2 font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[var(--color-text)] sm:text-5xl">
              Lojas parceiras em destaque
            </h2>
          </div>
          <Link
            href="/parceiros"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-6 transition hover:text-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            Ver todas as lojas <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {partnersResult.partners.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partnersResult.partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <EmptyPartners />
        )}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="grid overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-warm)] lg:grid-cols-[0.93fr_1.07fr]">
          <div className="flex min-h-72 flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Fortalecendo negócios que servem</p>
            <h2 className="mt-3 max-w-md font-[family-name:var(--font-playfair)] text-4xl leading-tight text-[var(--color-wine-dark)]">
              Sua empresa também pode fazer parte desta rede.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Apresente o seu negócio à comunidade e mantenha seus canais de atendimento organizados em um único diretório.
            </p>
            <Button asChild className="mt-7 w-full sm:w-fit">
              <a href="mailto:parcerias@cpadbelem.com.br?subject=Quero%20ser%20um%20parceiro">
                Seja um parceiro <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>

          <div className="grid gap-px bg-[var(--color-wine)] p-7 text-white sm:grid-cols-3 sm:p-10 lg:p-12">
            <Benefit icon={BarChart3} title="Mais visibilidade" text="para o seu negócio" />
            <Benefit icon={UsersRound} title="Conexão" text="com o público da comunidade" />
            <Benefit icon={Gem} title="Presença" text="em uma vitrine institucional" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BarChart3;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-h-44 flex-col justify-center border-white/18 py-5 sm:border-l sm:px-6 first:border-l-0 first:pl-0">
      <Icon className="h-8 w-8 text-[var(--color-gold-light)]" strokeWidth={1.35} aria-hidden />
      <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-2xl">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-white/72">{text}</p>
    </div>
  );
}

function EmptyPartners() {
  return (
    <div className="mt-8 border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-center">
      <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Em breve, novas lojas parceiras.</h3>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">O diretório ainda está recebendo seus primeiros cadastros.</p>
    </div>
  );
}
