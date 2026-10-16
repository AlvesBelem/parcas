import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageCircle, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PartnerProductSummary } from "@/lib/data/products";
import { getMarketplaceCta } from "@/lib/marketplaces";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: PartnerProductSummary }) {
  const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
  const cta = getMarketplaceCta({
    platform: product.platform,
    fallbackLabel: product.ctaLabel,
    fallbackColor: product.ctaColor,
  });
  const whatsappHref = getWhatsAppLink(product.whatsappNumber, "product");

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)]">
      <Link href={`/produtos/${product.slug}`} className="relative flex h-40 items-center justify-center bg-[var(--color-surface-warm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-focus)]">
        <Image src={coverImage} alt={product.name} fill className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-white/80 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[var(--color-wine)]">
          <ShoppingBag className="h-3 w-3" aria-hidden /> {product.category?.name ?? "Sem categoria"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Badge className="w-fit">{product.platform}</Badge>
        <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl leading-tight text-[var(--color-text)]">
          <Link href={`/produtos/${product.slug}`} className="transition hover:text-[var(--color-wine)]">{product.name}</Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">{product.description ?? "Produto disponível no catálogo afiliado."}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Link href={`/produtos/${product.slug}`} className="inline-flex min-h-10 items-center justify-center gap-1 text-xs font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 transition hover:text-[var(--color-wine-dark)]">
            Detalhes <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link href={`/out/product/${product.slug}`} prefetch={false} className="inline-flex min-h-10 items-center justify-center gap-1 px-2 text-center text-xs font-bold shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" style={{ backgroundColor: cta.color, color: cta.textColor }}>
            {cta.label} <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="col-span-2 inline-flex min-h-10 items-center justify-center gap-1.5 bg-[#25D366] px-3 text-xs font-bold text-[#073B23] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              Falar no WhatsApp <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
