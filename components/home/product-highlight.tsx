"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductHighlightProps = {
  products: PartnerProductSummary[];
};

export function ProductHighlight({ products }: ProductHighlightProps) {
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreview(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#eaded5] bg-[#fff8f3] p-8 text-center text-[#7a5a4b] shadow-[0_12px_35px_rgba(63,33,25,0.06)]">
        Ainda nao temos produtos em destaque. Cadastre o primeiro em /admin/products.
      </div>
    );
  }

  return (
    <>
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductHighlightCard
            key={product.id}
            product={product}
            onPreview={(payload) => setPreview(payload)}
          />
        ))}
      </div>
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizando ${preview.alt}`}
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#1d120d] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#2f1d15] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={(event) => {
                event.stopPropagation();
                setPreview(null);
              }}
            >
              Fechar
            </button>
            <div className="relative h-[70vh] w-full min-h-[320px]">
              <Image
                src={preview.src}
                alt={preview.alt}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductHighlightCard({
  product,
  onPreview,
}: {
  product: PartnerProductSummary;
  onPreview: (payload: { src: string; alt: string }) => void;
}) {
  const gallery = product.imageUrls.slice(0, 5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const coverImage = gallery[currentImageIndex] ?? "/logo_cpad_belem.svg";
  const isAmazon = product.platform.toLowerCase().includes("amazon");
  const ctaLabel = isAmazon ? "Adquira na Amazon" : "Ver produto/serviço";

  return (
    <article className="flex h-full w-full min-h-[430px] flex-col rounded-3xl border border-[#eaded5] bg-white p-4 text-[#3f2b22] shadow-[0_12px_35px_rgba(63,33,25,0.08)]">
      <div className="flex-1 space-y-3">
        <button
          type="button"
          className="relative h-44 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#f3e7de] bg-[#fff8f3] transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b02b24]"
          onClick={() => onPreview({ src: coverImage, alt: product.name })}
          aria-label={`Ampliar imagem de ${product.name}`}
        >
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-contain bg-[#fff8f3]"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
        </button>
        {gallery.length > 1 && (
          <div className="flex min-h-[52px] items-center gap-2 overflow-x-auto pb-1">
            {gallery.map((image, index) => {
              const active = index === currentImageIndex;
              return (
                <button
                  key={image + index.toString()}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border ${active ? "border-[#b02b24] ring-1 ring-[#f3cfc6]" : "border-[#eaded5]"} bg-white transition`}
                  aria-label={`Imagem ${index + 1} de ${product.name}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumb ${index + 1}`}
                    fill
                    className="object-contain bg-[#fff8f3]"
                    sizes="48px"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{product.platform}</Badge>
          <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
          <Badge variant="outline">{product.clickCount} cliques</Badge>
        </div>
        <h3 className="min-h-[3.8em] text-lg font-semibold leading-tight text-[#2f1d15]">
          {truncate(product.name, 80)}
        </h3>
        <p className="min-h-[3.6em] text-sm text-[#7a5a4b]">
          {truncate(
            product.description ?? "Produto autorizado pelos parceiros oficiais da rede.",
            140,
          )}
        </p>
      </div>
      <div className="mt-auto pt-3">
        <Button asChild className="w-full" variant="primary">
          <Link
            href={`/produtos/${product.slug}`}
            prefetch={false}
            className="inline-flex w-full items-center justify-center gap-2"
          >
            {ctaLabel}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}
