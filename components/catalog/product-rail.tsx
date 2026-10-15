import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getMarketplaceCta } from "@/lib/marketplaces";

type ProductRailProps = {
  title: string;
  products: PartnerProductSummary[];
};

export function ProductRail({ title, products }: ProductRailProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-3" aria-label={`Produtos da categoria ${title}`}>
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)]">{title}</h2>
        <Badge variant="outline">{products.length}</Badge>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {products.map((product) => {
            const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
            const cta = getMarketplaceCta({ platform: product.platform, fallbackLabel: product.ctaLabel, fallbackColor: product.ctaColor });
            return (
              <article key={product.id} className="flex w-[280px] shrink-0 flex-col overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
                <Link href={`/produtos/${product.slug}`} className="relative h-36 bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-focus)]">
                  <Image src={coverImage} alt={product.name} fill className="object-contain p-4" sizes="280px" unoptimized />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap gap-2"><Badge>{product.platform}</Badge><Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge></div>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl leading-tight text-[var(--color-text)]"><Link href={`/produtos/${product.slug}`} className="hover:text-[var(--color-wine)]">{product.name}</Link></h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--color-text-muted)]">{product.description ?? "Produto disponível no catálogo afiliado."}</p>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <Link href={`/produtos/${product.slug}`} className="inline-flex min-h-10 items-center justify-center gap-1 text-xs font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-wine-dark)]">Detalhes <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></Link>
                    <Link href={`/out/product/${product.slug}`} prefetch={false} className="inline-flex min-h-10 items-center justify-center gap-1 px-2 text-center text-xs font-bold shadow-sm transition hover:brightness-95" style={{ backgroundColor: cta.color, color: cta.textColor }}>{cta.label}<ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
