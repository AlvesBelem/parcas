import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, HeartHandshake, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

type MarketplaceHeroProps = {
  partnerCount: number;
  categoryCount: number;
};

const commitments = [
  { icon: HeartHandshake, label: "Negócios com propósito" },
  { icon: Building2, label: "Empresas no diretório" },
  { icon: ShoppingBag, label: "Produtos e serviços" },
];

export function MarketplaceHero({ partnerCount, categoryCount }: MarketplaceHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-wine-dark)] text-white">
      <Image
        src="/hero-parceiros.png"
        alt="Aperto de mãos em frente à CPAD Belém, representando a parceria entre negócios"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(81,7,31,0.98)_0%,rgba(81,7,31,0.93)_38%,rgba(81,7,31,0.48)_64%,rgba(81,7,31,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,0,11,0.42),transparent_42%)]" />

      <div className="relative mx-auto flex min-h-[500px] max-w-[1440px] items-center px-6 py-12 sm:px-10 lg:min-h-[480px] lg:px-16 lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
            Diretório de parceiros
          </p>
          <h1 className="max-w-2xl font-[family-name:var(--font-playfair)] text-5xl leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            Parceiros <span className="text-[var(--color-gold-light)]">CPAD Belém</span>
          </h1>
          <p className="mt-5 max-w-xl font-[family-name:var(--font-playfair)] text-2xl leading-tight text-white/90 sm:text-3xl">
            Juntos levando o Reino mais longe.
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
            Conheça empresas e empreendedores que caminham com os mesmos valores e apresentam seus canais de atendimento no diretório.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-[var(--color-gold-light)] text-[var(--color-wine-dark)] hover:bg-white">
              <Link href="/parceiros">
                Ver lojas parceiras <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10">
              <Link href="/produtos">Explorar produtos</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-sm">
            <Stat value={partnerCount} label="lojas no diretório" />
            <Stat value={categoryCount} label="categorias para explorar" />
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/12 bg-black/10">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-white/12 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-10 lg:px-16">
          {commitments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex min-h-18 items-center gap-3 py-4 text-sm font-semibold text-white/92 sm:px-6 first:pl-0">
              <Icon className="h-6 w-6 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} aria-hidden />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <p className="text-white/78"><span className="mr-1.5 font-[family-name:var(--font-playfair)] text-3xl leading-none text-[var(--color-gold-light)]">{value}</span>{label}</p>
  );
}
