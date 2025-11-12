import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function AdminOverviewPage() {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const userName = session?.user?.name ?? "admin";
  const userEmail = session?.user?.email ?? "sem-email";

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-white">
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="inline-flex items-center gap-1 text-lime-300">
            <ArrowLeft className="h-4 w-4" />
            Voltar para landing
          </Link>
          <span className="text-white/30">/</span>
          painel seguro
        </p>
        <h1 className="text-3xl font-semibold">
          Bem vindo, {userName}.
        </h1>
        <p className="text-sm text-white/60">
          Escolha uma das operacoes abaixo para cadastrar categorias ou parceiros.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span className="rounded-2xl border border-white/10 px-4 py-2">
            {userEmail}
          </span>
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" className="text-white">
              Sair
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="space-y-2 rounded-3xl border border-white/10 bg-black/30 px-6 py-5 text-white transition hover:border-lime-300/40 hover:bg-white/5"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              {card.badge}
            </p>
            <h2 className="text-2xl font-semibold">{card.title}</h2>
            <p className="text-sm text-white/70">{card.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const cards = [
  {
    badge: "Fluxo 01",
    title: "Cadastrar categorias",
    text: "Organize os grupos que aparecem no filtro da landing e no formulario de parceiros.",
    href: "/admin/categories",
  },
  {
    badge: "Fluxo 02",
    title: "Cadastrar parceiros",
    text: "Publique novas lojas verificadas com foto, link oficial e descricao curta.",
    href: "/admin/partners",
  },
  {
    badge: "Fluxo 03",
    title: "Produtos de parceiros",
    text: "Divulgue ofertas afiliadas da Hotmart, Kiwify, Amazon ou outras plataformas.",
    href: "/admin/products",
  },
];
