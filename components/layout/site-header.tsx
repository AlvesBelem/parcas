import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/styles/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
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
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">
              CPAD Belem
            </p>
            <p className="text-lg font-semibold">programa de parceiros cpad belem</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-white/70">
          <Link href="/#rede" className="hover:text-white">
            Rede Oficial
          </Link>
          <Link href="/#categorias" className="hover:text-white">
            Categorias
          </Link>
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
