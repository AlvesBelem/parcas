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
      <Card className="border-dashed border-[#b02a20]/20 bg-[#fff7f2] text-center text-sm text-neutral-700">
        <CardContent className="p-6">
          Nenhuma categoria cadastrada. Utilize o botão de cima para criar as primeiras.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#b02a20]/12 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription className="uppercase tracking-[0.25em] text-xs text-neutral-500">
            Categorias ativas
          </CardDescription>
          <CardTitle className="text-xl text-[#2d1c16]">Organize o catálogo</CardTitle>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-[#b02a20]/15 bg-[#fff7f2] p-4 text-[#2d1c16] shadow-[0_12px_36px_rgba(45,28,22,0.08)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  criado em {formatDate(category.createdAt)}
                </p>
                <p className="text-sm text-neutral-700">
                  {category.description ?? "Sem descrição cadastrada."}
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
                  className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={(event) => {
                    if (
                      !confirm(
                        `Deseja excluir a categoria "${category.name}"? Essa ação remove a categoria dos cadastros.`,
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
