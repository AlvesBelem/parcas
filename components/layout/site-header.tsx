"use client";

import { type FormEvent, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, UserRound, X } from "lucide-react";

import { cn } from "@/lib/utils";

const searchDestinations = {
  parceiros: "/parceiros",
  produtos: "/produtos",
  servicos: "/servicos",
} as const;

type SearchDestination = keyof typeof searchDestinations;

const navigation = [
  { href: "/parceiros", label: "Lojas Parceiras", pending: false },
  { href: "/produtos", label: "Produtos", pending: false },
  { href: "/servicos", label: "Serviços", pending: false },
  { label: "Sobre o Programa", pending: true },
  { href: "/seja-um-parceiro", label: "Como Funciona", pending: false },
  { label: "Dúvidas", pending: true },
  { label: "Contato", pending: true },
] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[var(--color-border)] bg-white shadow-[0_1px_0_rgba(32,32,32,0.04)]">
      <div className="mx-auto flex min-h-18 w-full max-w-[1440px] items-center gap-3 px-4 py-3 sm:px-6 lg:min-h-22 lg:px-8">
        <Link
          href="/parceiros"
          className="group flex shrink-0 items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          aria-label="Parceiros CPAD Belém — página inicial"
        >
          <Image
            src="/logo_cpad_belem.svg"
            alt="CPAD Belém"
            width={158}
            height={55}
            className="h-auto w-29 sm:w-36 lg:w-40"
            priority
          />
        </Link>

        <DirectorySearch className="hidden min-w-0 flex-1 md:flex" />

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <span
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--color-text-muted)]"
            aria-disabled="true"
            title="Favoritos serão disponibilizados em breve"
          >
            <Heart className="h-5 w-5 text-[var(--color-wine)]" aria-hidden />
            Favoritos
          </span>
          <Link
            href="/api/auth/signin?callbackUrl=%2Fadmin%2Foverview"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-wine)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <UserRound className="h-5 w-5 text-[var(--color-wine)]" aria-hidden />
            Área administrativa
          </Link>
          <Link
            href="/seja-um-parceiro"
            className="ml-2 inline-flex min-h-10 items-center rounded-lg bg-[linear-gradient(135deg,var(--color-gold),#9C671E)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(156,103,30,0.24)] transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Seja um Parceiro
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-wine)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="site-navigation"
        className={cn(
          "overflow-hidden border-t border-[var(--color-border)] bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          isMenuOpen ? "max-h-[680px] opacity-100" : "max-h-0 border-t-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6">
          <DirectorySearch className="flex md:hidden" onNavigate={() => setIsMenuOpen(false)} />
          <nav className="grid gap-1" aria-label="Navegação principal">
            {navigation.map((item) =>
              item.pending ? (
                <span
                  key={item.label}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-[var(--color-text-muted)]"
                  aria-disabled="true"
                  title="Página em preparação"
                >
                  {item.label}
                  <span className="ml-auto text-xs font-normal text-[var(--color-text-subtle)]">Em breve</span>
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-wine)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-4">
            <Link
              href="/api/auth/signin?callbackUrl=%2Fadmin%2Foverview"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-semibold text-[var(--color-wine)]"
            >
              <UserRound className="h-4 w-4" aria-hidden /> Área admin
            </Link>
            <Link
              href="/seja-um-parceiro"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-gold)] px-3 text-sm font-bold text-white"
            >
              Seja um Parceiro
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function DirectorySearch({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const searchId = useId();
  const [destination, setDestination] = useState<SearchDestination>("parceiros");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    const search = new URLSearchParams(query ? { q: query } : {}).toString();

    window.location.assign(`${searchDestinations[destination]}${search ? `?${search}` : ""}`);
    onNavigate?.();
  }

  return (
    <form action="/parceiros" className={cn("items-center", className)} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={searchId}>
        Buscar no catálogo
      </label>
      <div className="flex h-11 w-full overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-white shadow-[0_2px_8px_rgba(32,32,32,0.05)] focus-within:ring-2 focus-within:ring-[var(--color-focus)]">
        <input
          id={searchId}
          name="q"
          type="search"
          autoComplete="off"
          placeholder="O que você procura?"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
        />
        <select
          value={destination}
          onChange={(event) => setDestination(event.target.value as SearchDestination)}
          className="block max-w-30 border-l border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-xs font-semibold text-[var(--color-text)] outline-none"
          aria-label="Tipo de conteúdo para busca"
        >
          <option value="parceiros">Lojas</option>
          <option value="produtos">Produtos</option>
          <option value="servicos">Serviços</option>
        </select>
        <button
          type="submit"
          className="inline-flex w-13 items-center justify-center bg-[var(--color-wine)] text-white transition hover:bg-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-gold-light)]"
          aria-label="Buscar no catálogo"
        >
          <Search className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
