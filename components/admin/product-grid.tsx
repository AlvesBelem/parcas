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
      <Card className="border-dashed border-[#b02a20]/20 bg-[#fff7f2] text-center text-sm text-neutral-700">
        <CardContent className="p-6">
          Nenhum produto cadastrado ainda. Cadastre o primeiro clicando no botão acima.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#b02a20]/12 bg-white">
      <CardHeader>
        <CardDescription className="uppercase tracking-[0.3em] text-xs text-neutral-500">
          Lista de produtos
        </CardDescription>
        <CardTitle className="text-2xl text-[#2d1c16]">Produtos cadastrados</CardTitle>
        <p className="text-sm text-neutral-600">
          Use os botões laterais para editar, pausar ou excluir cada item.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => {
          const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
          return (
            <article
              key={product.id}
              className={`flex h-full min-h-[230px] flex-col rounded-2xl border ${product.active ? "border-[#b02a20]/15 bg-[#fff7f2]" : "border-red-300 bg-[#fff0ee]"} p-4 text-[#2d1c16] shadow-[0_12px_36px_rgba(45,28,22,0.08)]`}
            >
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-[#b02a20]/20 bg-white p-2">
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
                    <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
                    <Badge variant="outline">{product.clickCount} cliques</Badge>
                    {!product.active && (
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 line-clamp-2">
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
                          ? "text-[#b02a20] hover:border-[#b02a20]/40 hover:text-[#7d1a14]"
                          : "text-green-700 hover:border-green-500/40 hover:text-green-700"
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
                      className="text-red-600 hover:border-red-400 hover:text-red-700"
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
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-neutral-500">
                <span>Cadastrado em {formatDate(product.createdAt)}</span>
                <Link
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#b02a20] hover:text-[#7d1a14]"
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
