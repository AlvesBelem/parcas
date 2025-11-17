"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { AdminCategoryEntry } from "@/lib/data/categories";
import { deleteCategory } from "@/lib/actions/category-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CategoryListProps = {
  categories: AdminCategoryEntry[];
  onEdit: (category: AdminCategoryEntry) => void;
};

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  if (!categories.length) {
    return (
      <Card className="border-dashed border-white/20 bg-black/20 text-center text-sm text-white/70">
        <CardContent className="p-6">
          Nenhuma categoria cadastrada. Utilize o botao de cima para criar as primeiras.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-zinc-950/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription className="uppercase tracking-[0.25em] text-xs text-white/50">
            Categorias ativas
          </CardDescription>
          <CardTitle className="text-xl text-white">Organize o catalogo</CardTitle>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white shadow-lg shadow-black/20"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  criado em {formatDate(category.createdAt)}
                </p>
                <p className="text-sm text-white/60">
                  {category.description ?? "Sem descricao cadastrada."}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline">
                    {category.scope === "both"
                      ? "Parceiros + Produtos"
                      : category.scope === "partners"
                        ? "Parceiros"
                        : "Produtos"}
                  </Badge>
                  <Badge variant="outline">{category.partnerCount} parceiros</Badge>
                  <Badge variant="outline">{category.productCount} produtos</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="inline-flex items-center gap-2"
                onClick={() => onEdit(category)}
                disabled={!category.partnerId && !category.productCategoryId}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
              <form action={deleteCategory}>
                {category.partnerId && <input type="hidden" name="categoryId" value={category.partnerId} />}
                {category.productCategoryId && (
                  <input
                    type="hidden"
                    name="productCategoryId"
                    value={category.productCategoryId}
                  />
                )}
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-2 text-red-300 hover:bg-red-500/10 hover:text-red-100"
                  onClick={(event) => {
                    if (
                      !confirm(
                        `Deseja excluir a categoria "${category.name}"? Essa acao remove a categoria dos cadastros.`,
                      )
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </form>
            </div>
          </article>
        ))}
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
