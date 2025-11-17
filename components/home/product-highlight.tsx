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
      <div className="rounded-3xl border border-dashed border-white/20 bg-black/30 p-8 text-center text-white/70">
        Ainda nao temos produtos em destaque. Cadastre o primeiro em /admin/products.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
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
    }, 3000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const coverImage = gallery[currentImageIndex] ?? "/logo_cpad_belem.svg";
  const isAmazon = product.platform.toLowerCase().includes("amazon");
  const ctaLabel = isAmazon ? "Adquira na Amazon" : "Ver oferta oficial";

  return (
    <article className="flex h-full w-full max-w-[270px] flex-col rounded-3xl border border-white/10 bg-black/60 p-4 text-white">
      <div className="space-y-2.5">
        <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-contain bg-black/70"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-2">
            {gallery.map((image, index) => (
              <div
                key={image + index.toString()}
                className={`relative h-12 w-12 overflow-hidden rounded-lg border ${
                  index === currentImageIndex ? "border-lime-300" : "border-white/10"
                } bg-white/5 transition`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumb ${index + 1}`}
                  fill
                  className="object-contain bg-black/50"
                  sizes="48px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{product.platform}</Badge>
          <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
        </div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-white/70 line-clamp-3">
          {product.description ?? "Produto autorizado pelos parceiros oficiais da rede."}
        </p>
      </div>
      <div className="mt-auto pt-3">
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300/90 px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-200"
        >
          {ctaLabel}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
