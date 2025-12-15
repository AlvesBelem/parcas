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
      <Card className="border-dashed border-[#eaded5] bg-[#fff8f3] text-center text-sm text-[#7a5a4b]">
        <CardContent className="p-6">
          Nenhuma categoria cadastrada. Utilize o botão de cima para criar as primeiras.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#eaded5] bg-white shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription className="uppercase tracking-[0.25em] text-xs text-[#b02b24]">
            Categorias ativas
          </CardDescription>
          <CardTitle className="text-xl text-[#2f1d15]">Organize o catálogo</CardTitle>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-[#eaded5] bg-[#fff8f3] p-4 text-[#3f2b22] shadow-[0_10px_30px_rgba(63,33,25,0.06)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#2f1d15]">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-[#a38271]">
                  criado em {formatDate(category.createdAt)}
                </p>
                <p className="text-sm text-[#7a5a4b]">
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
                  className="inline-flex items-center gap-2 text-[#b02b24] hover:bg-[#fff1ec]"
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
