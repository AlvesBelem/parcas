import Link from "next/link";
import { ArrowRight, BarChart3, Layers, Package, Store, Wrench } from "lucide-react";

import { auth } from "@/auth";
import { ClickMetrics } from "@/components/admin/click-metrics";
import { Button } from "@/components/ui/button";
import { fetchCategoriesWithStats } from "@/lib/data/categories";
import {
  fetchPartnerClickSeries,
  fetchProductClickSeries,
  fetchServiceClickSeries,
  fetchTopPartnerClicks,
  fetchTopProductClicks,
  fetchTopServiceClicks,
} from "@/lib/data/click-stats";
import { fetchPartners } from "@/lib/data/partners";
import { fetchPartnerProducts } from "@/lib/data/products";
import { fetchServices } from "@/lib/data/services";

export default async function AdminOverviewPage() {
  const session = await auth();
  const [categories, partnerResult, productResult, serviceResult, partnerClicks, productClicks, serviceClicks, partnerSeries, productSeries, serviceSeries] = await Promise.all([
    fetchCategoriesWithStats(),
    fetchPartners({ page: 1, perPage: 50, includeInactive: true }),
    fetchPartnerProducts({ page: 1, perPage: 50, includeInactive: true }),
    fetchServices({ page: 1, perPage: 50, includeInactive: true }),
    Promise.all([fetchTopPartnerClicks(1), fetchTopPartnerClicks(7), fetchTopPartnerClicks(30), fetchTopPartnerClicks(365)]),
    Promise.all([fetchTopProductClicks(1), fetchTopProductClicks(7), fetchTopProductClicks(30), fetchTopProductClicks(365)]),
    Promise.all([fetchTopServiceClicks(1), fetchTopServiceClicks(7), fetchTopServiceClicks(30), fetchTopServiceClicks(365)]),
    fetchPartnerClickSeries(30),
    fetchProductClickSeries(30),
    fetchServiceClickSeries(30),
  ]);

  const stats = [
    { label: "Categorias", value: categories.length, detail: "Organizam os filtros públicos", href: "/admin/categories", icon: Layers },
    { label: "Parceiros", value: partnerResult.total, detail: `${partnerResult.partners.filter((partner) => partner.active).length} ativos nesta página`, href: "/admin/partners", icon: Store },
    { label: "Produtos", value: productResult.total, detail: `${productResult.products.filter((product) => product.active).length} ativos nesta página`, href: "/admin/products", icon: Package },
    { label: "Serviços", value: serviceResult.total, detail: `${serviceResult.services.filter((service) => service.active).length} ativos nesta página`, href: "/admin/services", icon: Wrench },
  ];

  const partnerStats = { day: partnerClicks[0], week: partnerClicks[1], month: partnerClicks[2], year: partnerClicks[3] } as const;
  const productStats = { day: productClicks[0], week: productClicks[1], month: productClicks[2], year: productClicks[3] } as const;
  const serviceStats = { day: serviceClicks[0], week: serviceClicks[1], month: serviceClicks[2], year: serviceClicks[3] } as const;
  const userName = session?.user?.name ?? "Administrador";

  return (
    <section className="space-y-8">
      <header className="border-b border-(--color-border) pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--color-wine)">Centro de controle</p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-(family-name:--font-playfair) text-4xl leading-tight text-(--color-text) sm:text-5xl">Visão geral</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--color-text-muted) sm:text-base">Olá, {userName}. Acompanhe cadastros, publicações e os acessos registrados nos links externos.</p>
          </div>
          <Button asChild variant="secondary" className="w-full sm:w-auto"><Link href="/">Ver vitrine pública <ArrowRight className="h-4 w-4" aria-hidden /></Link></Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group border border-(--color-border) bg-white p-5 shadow-(--shadow-card) transition hover:-translate-y-0.5 hover:border-(--color-gold) hover:shadow-(--shadow-raised) focus-visible:outline focus-visible:outline-offset-3 focus-visible:outline-(--color-focus)">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--color-wine)">{stat.label}</p>
                  <p className="mt-3 font-(family-name:--font-playfair) text-5xl leading-none text-(--color-text)">{stat.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center border border-(--color-border) bg-(--color-surface-warm) text-(--color-wine) group-hover:bg-(--color-wine) group-hover:text-white"><Icon className="h-5 w-5" aria-hidden /></span>
              </div>
              <p className="mt-5 flex items-center justify-between gap-3 text-sm text-(--color-text-muted)"><span>{stat.detail}</span><ArrowRight className="h-4 w-4 shrink-0 text-(--color-wine)" aria-hidden /></p>
            </Link>
          );
        })}
      </div>

      <section className="grid gap-6 border border-(--color-border) bg-white p-6 shadow-(--shadow-card) lg:grid-cols-[minmax(0,1fr)_300px]" aria-labelledby="quick-actions-title">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--color-wine)">Operação</p>
          <h2 id="quick-actions-title" className="mt-1 font-(family-name:--font-playfair) text-3xl text-(--color-text)">Atalhos de gestão</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <QuickAction href="/admin/categories" title="Categorias" text="Organize os filtros." />
            <QuickAction href="/admin/partners" title="Parceiros" text="Cadastre ou atualize lojas." />
            <QuickAction href="/admin/products" title="Produtos" text="Mantenha o catálogo legado." />
          </div>
        </div>
        <div className="border-t border-(--color-border) pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <BarChart3 className="h-8 w-8 text-(--color-gold)" strokeWidth={1.4} aria-hidden />
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl text-(--color-text)">Métricas com contexto</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Os números abaixo representam cliques nos links externos registrados pela aplicação.</p>
        </div>
      </section>

      <ClickMetrics partnerStats={partnerStats} productStats={productStats} serviceStats={serviceStats} partnerSeries={partnerSeries} productSeries={productSeries} serviceSeries={serviceSeries} />
    </section>
  );
}

function QuickAction({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="group border border-(--color-border) bg-(--color-surface) p-4 transition hover:border-(--color-gold) hover:bg-(--color-surface-warm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)">
      <p className="font-bold text-(--color-text)">{title}</p>
      <p className="mt-1 text-sm text-(--color-text-muted)">{text}</p>
      <ArrowRight className="mt-4 h-4 w-4 text-(--color-wine) transition group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
