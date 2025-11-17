import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers, Package, Store, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { fetchCategoriesWithStats } from "@/lib/data/categories";
import { fetchPartners } from "@/lib/data/partners";
import { fetchPartnerProducts } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const session = await auth();

  const [categories, partnerResult, productResult] = await Promise.all([
    fetchCategoriesWithStats(),
    fetchPartners({ page: 1, perPage: 50, includeInactive: true }),
    fetchPartnerProducts({ page: 1, perPage: 50, includeInactive: true }),
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
      description: "Publique lojas verificadas e mantenha o vitrine atualizada.",
      href: "/admin/partners",
    },
    {
      title: "Cadastrar produto",
      description: "Inclua ofertas afiliadas com imagens, links e precos.",
      href: "/admin/products",
    },
  ];

  const lastCategories = categories.slice(0, 3);
  const userName = session?.user?.name ?? "admin";
  const userEmail = session?.user?.email ?? "sem-email";

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="inline-flex items-center gap-1 text-lime-300">
              <ArrowLeft className="h-4 w-4" />
              Voltar para landing
            </Link>
            <span className="text-white/30">/</span>
            painel seguro
          </p>
          <h1 className="text-3xl font-semibold">Visao geral</h1>
          <p className="text-sm text-white/60">
            Controle rapido do admin. Acesse listas, cadastros e status em um painel unico.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Usuario logado</p>
          <p className="font-semibold">{userName}</p>
          <p className="text-white/50">{userEmail}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-white/10 bg-black/40 backdrop-blur transition hover:border-lime-200/30"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardDescription className="uppercase tracking-[0.3em] text-xs text-white/50">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-3xl text-white">{stat.value}</CardTitle>
                  <p className="text-sm text-white/60">{stat.helper}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lime-200">
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-2 text-sm text-lime-200 hover:text-lime-100"
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
        <Card className="border-white/10 bg-zinc-950/70">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription className="uppercase tracking-[0.35em] text-xs text-white/50">
                Atalhos
              </CardDescription>
              <CardTitle className="text-xl text-white">Fluxos principais</CardTitle>
              <p className="text-sm text-white/60">
                Acesse rapidamente os cadastros mais usados.
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-lime-200" />
          </CardHeader>
          <CardContent className="space-y-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 transition hover:border-lime-200/40 hover:bg-white/5"
              >
                <div>
                  <p className="text-sm font-semibold">{shortcut.title}</p>
                  <p className="text-sm text-white/60">{shortcut.description}</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/30">
          <CardHeader>
            <CardDescription className="uppercase tracking-[0.35em] text-xs text-white/50">
              Ultimas categorias
            </CardDescription>
            <CardTitle className="text-xl text-white">O que mudou?</CardTitle>
            <p className="text-sm text-white/60">
              Monitoramento rapido das ultimas entradas.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {lastCategories.length ? (
              lastCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    criado em {formatDate(category.createdAt)}
                  </p>
                  <p className="text-sm text-white/60">
                    {category.description ?? "Sem descricao."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">Nenhuma categoria cadastrada ainda.</p>
            )}
            <Button asChild variant="secondary" className="w-full">
              <Link href="/admin/categories">Ir para categorias</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
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
