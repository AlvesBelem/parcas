"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/styles/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#8c1f18]/30 bg-[#b02a20] text-white shadow-md shadow-[#8c1f18]/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="https://cpadbelem.com.br/" className="flex items-center gap-3 text-white">
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
              <p className="text-xs uppercase tracking-[0.25em] text-white/75">CPAD Belem</p>
              <p className="text-lg font-semibold leading-tight">
                Programa de parceiros e produtos oficiais
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/overview"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "border-white/40 bg-white text-[#b02a20] hover:bg-white/90",
              )}
            >
              Area do admin
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
