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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-black/60 p-5 text-white">
      <div className="space-y-3">
        <div className="relative h-44 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                className={`relative h-14 w-14 overflow-hidden rounded-xl border ${
                  index === currentImageIndex ? "border-lime-300" : "border-white/10"
                } bg-white/5 transition`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumb ${index + 1}`}
                  fill
                  className="object-contain bg-black/50"
                  sizes="56px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{product.platform}</Badge>
          <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
          {product.price && (
            <Badge variant="outline">R$ {Number(product.price).toFixed(2)}</Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-sm text-white/70 line-clamp-3">
          {product.description ?? "Produto autorizado pelos parceiros oficiais da rede."}
        </p>
      </div>
      <div className="mt-auto pt-4">
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300/90 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-200"
        >
          Ver oferta
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
