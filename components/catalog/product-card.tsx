import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageCircle, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PartnerProductSummary } from "@/lib/data/products";
import { getMarketplaceCta } from "@/lib/marketplaces";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function ProductCard({ product, featured = false }: { product: PartnerProductSummary; featured?: boolean }) {
  const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
  const cta = getMarketplaceCta({
    platform: product.platform,
    fallbackLabel: product.ctaLabel,
    fallbackColor: product.ctaColor,
  });
  const whatsappHref = getWhatsAppLink(product.whatsappNumber, "product");
  const hasProductImage = product.imageUrls.length > 0;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[var(--shadow-raised)]">
      <Link href={`/produtos/${product.slug}`} className="relative flex h-52 items-center justify-center overflow-hidden rounded-t-2xl bg-[var(--color-surface-warm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-focus)] sm:h-56">
        <Image src={coverImage} alt={product.name} fill className={`transition duration-500 group-hover:scale-[1.045] ${hasProductImage ? "object-cover" : "object-contain p-8"}`} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/25 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/92 px-3 py-1.5 text-[11px] font-bold text-[var(--color-wine)] shadow-sm backdrop-blur">
          <ShoppingBag className="h-3 w-3" aria-hidden /> {product.category?.name ?? "Sem categoria"}
        </span>
      </Link>
      {featured ? <span className="featured-card-star pointer-events-none absolute -right-3 -top-4 z-20 h-16 w-16 sm:h-20 sm:w-20" title="Destaque no banner"><Image src="/estrela.png" alt="" width={80} height={80} className="h-full w-full object-contain" aria-hidden /><span className="sr-only">Em destaque no banner</span></span> : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Badge className="w-fit">{product.platform}</Badge>
        <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl leading-tight text-[var(--color-text)]">
          <Link href={`/produtos/${product.slug}`} className="transition hover:text-[var(--color-wine)]">{product.name}</Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">{product.description ?? "Produto disponível no catálogo afiliado."}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Link href={`/produtos/${product.slug}`} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-[var(--color-wine)] bg-white px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
            Detalhes <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link href={`/out/product/${product.slug}`} prefetch={false} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-2 text-center text-xs font-bold shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" style={{ backgroundColor: cta.color, color: cta.textColor }}>
            {cta.label} <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="col-span-2 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 text-xs font-bold text-[#073B23] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              Falar no WhatsApp <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
