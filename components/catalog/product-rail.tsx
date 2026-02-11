import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type ProductRailProps = {
  title: string;
  products: PartnerProductSummary[];
};

export function ProductRail({ title, products }: ProductRailProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </h3>
        <Badge variant="outline">{products.length}</Badge>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {products.map((product) => {
            const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
            return (
              <article
                key={product.id}
                className="relative w-[260px] shrink-0 overflow-hidden rounded-3xl border border-[#eaded5] bg-white shadow-[0_14px_44px_rgba(63,33,25,0.1)] transition hover:-translate-y-1"
              >
                <div className="relative h-32 w-full bg-[#fff8f3]">
                  <Image
                    src={coverImage}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="260px"
                    unoptimized
                  />
                </div>
                <div className="space-y-2 p-4 text-[#3f2b22]">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-semibold line-clamp-2">{product.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge>{product.platform}</Badge>
                    <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
                  </div>
                  <p className="line-clamp-3 text-sm text-[#7a5a4b]">
                    {product.description ?? "Oferta oficial com link verificado."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#a38271]">
                    <span>{new Intl.DateTimeFormat("pt-BR").format(new Date(product.createdAt))}</span>
                    <span>{product.clickCount} cliques</span>
                  </div>
                  <Link
                    href={`/produtos/${product.slug}`}
                    prefetch={false}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b02b24] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(178,45,38,0.2)] hover:bg-[#8f1f19]"
                  >
                    Ver oferta
                    <ExternalLink className="h-4 w-4" />
                  </Link>
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
