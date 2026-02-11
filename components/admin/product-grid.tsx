"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power, Trash2 } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/product-actions";

type ProductGridProps = {
  products: PartnerProductSummary[];
  onEdit: (product: PartnerProductSummary) => void;
};

export function ProductGrid({ products, onEdit }: ProductGridProps) {
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
      <Card className="border-dashed border-[#eaded5] bg-[#fff8f3] text-center text-sm text-[#7a5a4b]">
        <CardContent className="p-6">
          Nenhum produto cadastrado ainda. Cadastre o primeiro clicando no botão acima.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.3em] text-xs text-[#b02b24]">
          Lista de produtos
        </CardDescription>
        <CardTitle className="text-2xl text-[#2f1d15]">Produtos cadastrados</CardTitle>
        <p className="text-sm text-[#7a5a4b]">
          Use os botões laterais para editar, pausar ou excluir cada item.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => {
          const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
          return (
            <article
              key={product.id}
              className={`flex h-full min-h-[230px] flex-col rounded-2xl border ${product.active ? "border-[#eaded5] bg-[#fff8f3]" : "border-[#f0c7c3] bg-[#fff1ec]"} p-4 text-[#3f2b22] shadow-[0_10px_30px_rgba(63,33,25,0.06)]`}
            >
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <button
                  type="button"
                  className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-[#eaded5] bg-white p-2 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b02b24]"
                  onClick={() => setPreview({ src: coverImage, alt: product.name })}
                  aria-label={`Ampliar imagem de ${product.name}`}
                >
                  <Image
                    src={coverImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                    unoptimized
                  />
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-[#2f1d15]">{product.name}</h3>
                    <Badge>{product.platform}</Badge>
                    <Badge variant="outline">
                      {product.category?.name ?? "Sem categoria"}
                    </Badge>
                    <Badge variant="outline">{product.clickCount} cliques</Badge>
                    {!product.active && (
                      <Badge variant="outline" className="text-[#b02b24]">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#7a5a4b] line-clamp-2">
                    {product.description ?? "Produto sem descrição cadastrada."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => onEdit(product)}
                    aria-label={`Editar ${product.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <form action={toggleProductStatus}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="nextStatus" value={(!product.active).toString()} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className={
                        product.active
                          ? "text-[#b02b24] hover:bg-[#fff1ec]"
                          : "text-[#1b7b41] hover:bg-[#e9f7ef]"
                      }
                      aria-label={`${product.active ? "Desativar" : "Reativar"} ${product.name}`}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  </form>
                  <form action={deleteProduct}>
                    <input type="hidden" name="productId" value={product.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-[#b02b24] hover:bg-[#fff1ec]"
                      aria-label={`Excluir ${product.name}`}
                      onClick={(event) => {
                        if (
                          !confirm(
                            `Tem certeza que deseja excluir "${product.name}"? Essa ação não pode ser desfeita.`,
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-[#a38271]">
                <span>Cadastrado em {formatDate(product.createdAt)}</span>
                <Link
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#b02b24] hover:text-[#8f1f19]"
                >
                  Ver produto
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </CardContent>
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizando ${preview.alt}`}
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#1d120d] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
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
            <div className="relative h-[60vh] w-full min-h-[300px]">
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
    </Card>
  );
}

function formatDate(date: Date | string) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatter.format(new Date(date));
}
