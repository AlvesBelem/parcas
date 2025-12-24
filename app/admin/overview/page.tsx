import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers, Package, Store, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { fetchCategoriesWithStats } from "@/lib/data/categories";
import { fetchPartners } from "@/lib/data/partners";
import { fetchPartnerProducts } from "@/lib/data/products";
import {
  fetchTopPartnerClicks,
  fetchTopProductClicks,
  fetchPartnerClickSeries,
  fetchProductClickSeries,
} from "@/lib/data/click-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClickMetrics } from "@/components/admin/click-metrics";

export default async function AdminOverviewPage() {
  const session = await auth();

  const [categories, partnerResult, productResult, partnerClicks, productClicks, partnerSeries, productSeries] =
    await Promise.all([
      fetchCategoriesWithStats(),
      fetchPartners({ page: 1, perPage: 50, includeInactive: true }),
      fetchPartnerProducts({ page: 1, perPage: 50, includeInactive: true }),
      Promise.all([
        fetchTopPartnerClicks(1),
        fetchTopPartnerClicks(7),
        fetchTopPartnerClicks(30),
        fetchTopPartnerClicks(365),
      ]),
      Promise.all([
        fetchTopProductClicks(1),
        fetchTopProductClicks(7),
        fetchTopProductClicks(30),
        fetchTopProductClicks(365),
      ]),
      fetchPartnerClickSeries(30),
      fetchProductClickSeries(30),
    ]);

  const stats = [
    {
      label: "Categorias",
      value: categories.length,
      helper: "Usadas em filtros e cadastros.",
      icon: Layers,
      href: "/admin/categories",
    },
    {
      label: "Parceiros",
      value: partnerResult.total,
      helper: `${partnerResult.partners.filter((partner) => partner.active).length} ativos nesta lista.`,
      icon: Store,
      href: "/admin/partners",
    },
    {
      label: "Produtos",
      value: productResult.total,
      helper: `${productResult.products.filter((product) => product.active).length} ativos nesta lista.`,
      icon: Package,
      href: "/admin/products",
    },
  ];

  const shortcuts = [
    {
      title: "Cadastrar categoria",
      description: "Crie grupos para organizar parceiros e produtos.",
      href: "/admin/categories",
    },
    {
      title: "Cadastrar parceiro",
      description: "Publique lojas verificadas e mantenha a vitrine atualizada.",
      href: "/admin/partners",
    },
    {
      title: "Cadastrar produto",
      description: "Inclua ofertas afiliadas com imagens, links e preços.",
      href: "/admin/products",
    },
  ];

  const lastCategories = categories.slice(0, 3);
  const userName = session?.user?.name ?? "admin";
  const userEmail = session?.user?.email ?? "sem-email";
  const partnerStats = {
    day: partnerClicks[0],
    week: partnerClicks[1],
    month: partnerClicks[2],
    year: partnerClicks[3],
  } as const;
  const productStats = {
    day: productClicks[0],
    week: productClicks[1],
    month: productClicks[2],
    year: productClicks[3],
  } as const;

  return (
    <section className="space-y-6 text-[#2d1c16]">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#b02a20]/15 bg-white/80 p-5 text-center shadow-sm sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="space-y-2">
          <p className="flex items-center justify-center gap-2 text-sm text-[#b02a20] sm:justify-start">
            <Link href="/" className="inline-flex items-center gap-1 text-[#b02a20] underline-offset-4 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Voltar para landing
            </Link>
            <span className="text-neutral-500">/</span>
            painel seguro
          </p>
          <h1 className="text-3xl font-semibold">Visão geral</h1>
          <p className="text-sm text-neutral-600">
            Controle rápido do admin. Acesse listas, cadastros e status em um painel único.
          </p>
        </div>
        <div className="w-full rounded-2xl border border-[#b02a20]/15 bg-[#fff0e6] px-4 py-3 text-sm text-neutral-700 sm:w-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Usuário logado</p>
          <p className="font-semibold text-[#2d1c16]">{userName}</p>
          <p className="text-neutral-600">{userEmail}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-[#b02a20]/10 bg-white backdrop-blur transition hover:border-[#b02a20]/40"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardDescription className="uppercase tracking-[0.3em] text-xs text-neutral-500">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-3xl text-[#2d1c16]">{stat.value}</CardTitle>
                  <p className="text-sm text-neutral-600">{stat.helper}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b02a20]/20 bg-[#fff0e6] text-[#b02a20]">
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-2 text-sm text-[#b02a20] hover:text-[#7d1a14]"
                >
                  Ver detalhes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-[#b02a20]/10 bg-white/90">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription className="uppercase tracking-[0.35em] text-xs text-neutral-500">
                Atalhos
              </CardDescription>
              <CardTitle className="text-xl text-[#2d1c16]">Fluxos principais</CardTitle>
              <p className="text-sm text-neutral-600">Acesse rapidamente os cadastros mais usados.</p>
            </div>
            <Sparkles className="h-8 w-8 text-[#b02a20]" />
          </CardHeader>
          <CardContent className="space-y-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="flex items-center justify-between rounded-2xl border border-[#b02a20]/15 bg-[#fff7f2] px-4 py-3 transition hover:border-[#b02a20]/40 hover:bg-[#fff0e6]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#2d1c16]">{shortcut.title}</p>
                  <p className="text-sm text-neutral-600">{shortcut.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#b02a20]" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#b02a20]/10 bg-white">
          <CardHeader>
            <CardDescription className="uppercase tracking-[0.35em] text-xs text-neutral-500">
              Últimas categorias
            </CardDescription>
            <CardTitle className="text-xl text-[#2d1c16]">O que mudou?</CardTitle>
            <p className="text-sm text-neutral-600">Monitoramento rápido das últimas entradas.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {lastCategories.length ? (
              lastCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-[#b02a20]/15 bg-[#fff7f2] px-4 py-3"
                >
                  <p className="font-semibold text-[#2d1c16]">{category.name}</p>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    criado em {formatDate(category.createdAt)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {category.description ?? "Sem descrição."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-600">Nenhuma categoria cadastrada ainda.</p>
            )}
            <Button asChild variant="secondary" className="w-full">
              <Link href="/admin/categories">Ir para categorias</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ClickMetrics
        partnerStats={partnerStats}
        productStats={productStats}
        partnerSeries={partnerSeries}
        productSeries={productSeries}
      />
    </section>
  );
}

function formatDate(date: Date | string) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatter.format(new Date(date));
}
