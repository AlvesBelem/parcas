import Link from "next/link";
import { ArrowRight, Building2, Handshake, HeartHandshake, ShoppingBag } from "lucide-react";

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_67%_16%,rgba(241,199,125,0.42),transparent_20%),radial-gradient(circle_at_51%_95%,rgba(195,148,77,0.25),transparent_34%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[47%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.06)_45%,rgba(255,255,255,0.14)_46%,transparent_72%)] lg:block" />

      <div className="relative mx-auto grid min-h-[480px] max-w-[1440px] gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:px-16 lg:py-16">
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
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:mr-0">
          <div className="absolute -inset-6 rounded-full bg-[var(--color-gold)]/15 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden border border-white/15 bg-white/[0.07] p-5 shadow-[0_28px_65px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-6">
            <div className="flex aspect-[1.22] items-center justify-center border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.02))]">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[var(--color-gold-light)]/60 bg-[var(--color-wine)] shadow-[0_0_0_18px_rgba(241,199,125,0.08)]">
                <Handshake className="h-16 w-16 text-[var(--color-gold-light)]" strokeWidth={1.25} aria-hidden />
                <span className="absolute -bottom-4 rounded-full border border-white/20 bg-[var(--color-wine-dark)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Nossa rede
                </span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat value={partnerCount} label="lojas no diretório" />
              <Stat value={categoryCount} label="categorias" />
            </div>
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
    <div className="border-l-2 border-[var(--color-gold-light)] pl-3">
      <p className="font-[family-name:var(--font-playfair)] text-3xl leading-none text-white">{value}</p>
      <p className="mt-1 text-xs leading-4 text-white/68">{label}</p>
    </div>
  );
}
