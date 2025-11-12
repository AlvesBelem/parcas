"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { toggleProductStatus } from "@/lib/actions/product-actions";

type ProductGridProps = {
  products: PartnerProductSummary[];
  onEdit: (product: PartnerProductSummary) => void;
};

export function ProductGrid({ products, onEdit }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-black/20 p-8 text-center text-sm text-white/70">
        Nenhum produto cadastrado ainda. Cadastre o primeiro clicando no botao acima.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
        return (
          <article
            key={product.id}
            className={`rounded-2xl border ${product.active ? "border-white/10 bg-black/30" : "border-red-400/30 bg-black/10"} p-4 text-white`}
          >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white p-2">
              <Image
                src={coverImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="80px"
                unoptimized
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <Badge>{product.platform}</Badge>
                <Badge variant="outline">
                  {product.category?.name ?? "Sem categoria"}
                </Badge>
                {product.price && (
                  <Badge variant="outline">R$ {Number(product.price).toFixed(2)}</Badge>
                )}
                {!product.active && <Badge variant="outline" className="text-red-300">Inativo</Badge>}
              </div>
              <p className="text-sm text-white/70">
                {product.description ?? "Produto sem descricao cadastrada."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/50 hover:text-white"
                aria-label={`Editar ${product.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <form action={toggleProductStatus}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="nextStatus" value={(!product.active).toString()} />
                <button
                  type="submit"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                    product.active
                      ? "border-white/10 text-white/70 hover:border-red-400 hover:text-red-400"
                      : "border-lime-300/40 text-lime-200 hover:border-lime-200 hover:text-lime-100"
                  }`}
                  aria-label={`${product.active ? "Desativar" : "Reativar"} ${product.name}`}
                >
                  <Power className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-white/40">
              <span>Cadastrado em {formatDate(product.createdAt)}</span>
            <Link
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-lime-200 hover:text-lime-100"
            >
              Ver produto
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </article>
        );
      })}
    </div>
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
