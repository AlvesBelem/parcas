"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";

type ProductHighlightProps = {
  products: PartnerProductSummary[];
};

export function ProductHighlight({ products }: ProductHighlightProps) {
  if (!products.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#b02a20]/20 bg-[#fff4ee] p-8 text-center text-neutral-700">
        Ainda não temos produtos em destaque. Cadastre o primeiro em /admin/products.
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductHighlightCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductHighlightCard({ product }: { product: PartnerProductSummary }) {
  const gallery = product.imageUrls.slice(0, 5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const coverImage = gallery[currentImageIndex] ?? "/logo_cpad_belem.svg";
  const isAmazon = product.platform.toLowerCase().includes("amazon");
  const ctaLabel = isAmazon ? "Adquira na Amazon" : "Ver oferta oficial";

  return (
    <article className="flex h-full w-full min-h-[420px] flex-col rounded-[22px] border border-black/5 bg-white p-4 text-[#2d1c16] shadow-[0_18px_60px_rgba(45,28,22,0.08)]">
      <div className="flex-1 space-y-3">
        <div className="relative h-44 overflow-hidden rounded-2xl border border-[#b02a20]/10 bg-[#fff4ee]">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-contain bg-white"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge>{product.platform}</Badge>
            <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
          </div>
        </div>
        {gallery.length > 1 && (
          <div className="flex min-h-[52px] items-center gap-2 overflow-x-auto pb-1">
            {gallery.map((image, index) => {
              const active = index === currentImageIndex;
              return (
                <button
                  key={image + index.toString()}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border ${active ? "border-[#b02a20]" : "border-black/10"} bg-[#fff4ee] transition`}
                  aria-label={`Imagem ${index + 1} de ${product.name}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumb ${index + 1}`}
                    fill
                    className="object-contain bg-white"
                    sizes="48px"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        )}
        <h3 className="min-h-[3.6em] text-lg font-semibold leading-tight text-[#2d1c16]">
          {truncate(product.name, 80)}
        </h3>
        <p className="min-h-[3.6em] text-sm text-neutral-700">
          {truncate(product.description ?? "Produto autorizado pelos parceiros oficiais da rede.", 140)}
        </p>
      </div>
      <div className="mt-auto pt-3">
        <Link
          href={`/out/product/${product.slug}`}
          prefetch={false}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b02a20] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a231a] shadow-md shadow-[#8c1f18]/20"
        >
          {ctaLabel}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}
