"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/styles/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#8c1f18]/30 bg-[#b02a20] text-white shadow-md shadow-[#8c1f18]/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="https://cpadbelem.com.br/"
            className="flex items-center gap-3 text-white"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
              <Image
                src="/LOGO_VETOR_CPAD_FOGO.svg"
                alt="Logomarca CPAD Belem"
                width={36}
                height={36}
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/75">
                CPAD Belém
              </p>
              <p className="text-lg font-semibold leading-tight">
                Programa de parceiros e produtos oficiais
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
              Loja virtual CPAD Belém
            </Badge>
            <Link
              href="/admin/overview"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "border-white/40 bg-white text-[#b02a20] hover:bg-white/90",
              )}
            >
              Área do admin
            </Link>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-white/90">
          <Link href="/#rede" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/16">
            Rede oficial
          </Link>
          <Link href="/#categorias" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/16">
            Categorias
          </Link>
          <Link href="/#produtos" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/16">
            Produtos
          </Link>
          <a
            href="https://cpadbelem.com.br/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-3 py-1.5 underline-offset-4 hover:underline"
          >
            Loja CPAD Belém
          </a>
        </nav>
      </div>
    </header>
  );
}
