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
  const userName = session?.user?.name ?? "Admin";
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
    <section className="space-y-6 text-[#3f2b22]">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="space-y-2">
          <p className="flex items-center justify-center gap-2 text-sm text-[#7a5a4b] sm:justify-start">
            <Link href="/" className="inline-flex items-center gap-1 text-[#b02b24]">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a vitrine
            </Link>
            <span className="text-[#c2a999]">/</span>
            painel seguro
          </p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
            Visão geral
          </h1>
          <p className="text-sm text-[#7a5a4b]">
            Controle rápido do admin. Acesse listas, cadastros e status em um painel único.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-[#eaded5] bg-white px-4 py-3 text-sm text-[#7a5a4b] shadow-[0_10px_30px_rgba(63,33,25,0.08)] sm:w-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b02b24]">Usuário logado</p>
          <p className="font-semibold text-[#2f1d15]">{userName}</p>
          <p className="text-[#7a5a4b]">{userEmail}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(63,33,25,0.12)]"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardDescription className="uppercase tracking-[0.3em] text-xs text-[#b02b24]">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-3xl text-[#2f1d15]">{stat.value}</CardTitle>
                  <p className="text-sm text-[#7a5a4b]">{stat.helper}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eaded5] bg-[#fff8f3] text-[#b02b24]">
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#b02b24] hover:text-[#8f1f19]"
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
        <Card className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription className="uppercase tracking-[0.35em] text-xs text-[#b02b24]">
                Atalhos
              </CardDescription>
              <CardTitle className="text-xl text-[#2f1d15]">Fluxos principais</CardTitle>
              <p className="text-sm text-[#7a5a4b]">
                Acesse rapidamente os cadastros mais usados.
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-[#d37b2a]" />
          </CardHeader>
          <CardContent className="space-y-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="flex items-center justify-between rounded-2xl border border-[#eaded5] bg-[#fff8f3] px-4 py-3 transition hover:border-[#d7c6bc] hover:bg-[#fff1ec]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#2f1d15]">{shortcut.title}</p>
                  <p className="text-sm text-[#7a5a4b]">{shortcut.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#b02b24]" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
          <CardHeader>
            <CardDescription className="uppercase tracking-[0.35em] text-xs text-[#b02b24]">
              Últimas categorias
            </CardDescription>
            <CardTitle className="text-xl text-[#2f1d15]">O que mudou?</CardTitle>
            <p className="text-sm text-[#7a5a4b]">Monitoramento rápido das últimas entradas.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {lastCategories.length ? (
              lastCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-[#eaded5] bg-[#fff8f3] px-4 py-3"
                >
                  <p className="font-semibold text-[#2f1d15]">{category.name}</p>
                  <p className="text-xs uppercase tracking-wide text-[#a38271]">
                    criado em {formatDate(category.createdAt)}
                  </p>
                  <p className="text-sm text-[#7a5a4b]">
                    {category.description ?? "Sem descrição."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#7a5a4b]">Nenhuma categoria cadastrada ainda.</p>
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
