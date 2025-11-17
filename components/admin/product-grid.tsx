"use client";

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
  if (!products.length) {
    return (
      <Card className="border-dashed border-white/20 bg-black/20 text-center text-sm text-white/70">
        <CardContent className="p-6">
          Nenhum produto cadastrado ainda. Cadastre o primeiro clicando no botao acima.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-zinc-950/60">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.3em] text-xs text-white/50">
          Lista de produtos
        </CardDescription>
        <CardTitle className="text-2xl text-white">Produtos cadastrados</CardTitle>
        <p className="text-sm text-white/60">
          Use os botoes laterais para editar, pausar ou excluir cada item.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => {
          const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
          return (
            <article
              key={product.id}
              className={`flex h-full min-h-[230px] flex-col rounded-2xl border ${product.active ? "border-white/10 bg-black/30" : "border-red-400/30 bg-black/10"} p-4 text-white shadow-lg shadow-black/20`}
            >
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
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
                    <Badge variant="outline">{product.clickCount} cliques</Badge>
                    {!product.active && (
                      <Badge variant="outline" className="text-red-300">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/70 line-clamp-2">
                    {product.description ?? "Produto sem descricao cadastrada."}
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
                          ? "text-white/70 hover:border-red-400 hover:text-red-200"
                          : "text-lime-200 hover:border-lime-200 hover:text-lime-100"
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
                      className="text-red-300 hover:border-red-400 hover:text-red-100"
                      aria-label={`Excluir ${product.name}`}
                      onClick={(event) => {
                        if (
                          !confirm(
                            `Tem certeza que deseja excluir "${product.name}"? Essa acao nao pode ser desfeita.`,
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
      </CardContent>
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
