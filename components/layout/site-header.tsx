"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/parceiros", label: "Parceiros" },
  { href: "/produtos", label: "Produtos" },
  { href: "https://cpadbelem.com.br/", label: "Voltar para o site CPAD Belém" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-[0_14px_34px_rgba(150,45,30,0.18)]">
      <div className="hidden bg-linear-to-r from-[#8b0e0b] via-[#b02b24] to-[#d34b34] text-white md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.22em] text-white/85">Rede oficial CPAD Belém</p>
          <div className="flex flex-wrap items-center gap-4 text-white">
            <a href="tel:+5591981271407" className="hover:text-[#ffe6d6]">
              Central: (91) 98127-1407
            </a>
            <span className="hidden h-4 w-px bg-white/40 md:block" aria-hidden />
            <a href="mailto:parcerias@cpadbelem.com.br" className="hover:text-[#ffe6d6]">
              parcerias@cpadbelem.com.br
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur supports-backdrop-filter:backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Link
              href="https://cpadbelem.com.br/"
              className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-[#ffe7d7] via-[#fff3eb] to-[#ffd7c2] px-3 py-2 text-[#7b5140] shadow-[0_10px_26px_rgba(178,45,38,0.16)]"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#b02b24] to-[#e66a4a] text-white shadow-[0_8px_22px_rgba(178,45,38,0.35)]">
                <Image
                  src="/LOGO_VETOR_CPAD_FOGO.svg"
                  alt="Logomarca CPAD Belém"
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#b02b24]">CPAD Belém</p>
                <p className="text-lg font-semibold text-[#2f1d15]">
                  Parceiros e ofertas oficiais
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-4 rounded-2xl border border-[#e9c9b8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#b02b24] shadow-[0_10px_26px_rgba(178,45,38,0.12)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 transition hover:bg-[#fff4ef] hover:text-[#8f1f19]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

