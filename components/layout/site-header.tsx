"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/styles/button";

const navLinks = [
  { href: "/#rede", label: "Rede Oficial" },
  { href: "/#categorias", label: "Categorias" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-0 px-6 py-3 text-center sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:py-4 sm:text-left">
        <Link href="https://cpadbelem.com.br/" className="flex flex-col items-center gap-3 text-white sm:flex-row sm:text-left">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-lime-300/20">
            <Image
              src="/LOGO_VETOR_CPAD_FOGO.svg"
              alt="Logomarca CPAD Belem"
              width={32}
              height={32}
              priority
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">CPAD Belem</p>
            <p className="text-lg font-semibold">programa de parceiros cpad belem</p>
          </div>
        </Link>

        <nav className="hidden items-start gap-3 text-sm text-white/70 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/overview"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Area do admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
