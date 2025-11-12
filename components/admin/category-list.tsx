"use client";

import type { CategoryWithStats } from "@/lib/data/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CategoryListProps = {
  categories: CategoryWithStats[];
  onEdit: (category: CategoryWithStats) => void;
};

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  if (!categories.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-black/20 p-8 text-center text-sm text-white/70">
        Nenhuma categoria cadastrada. Utilize o formulario ao lado para criar as primeiras.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Categorias ativas
          </p>
          <h2 className="text-xl font-semibold text-white">Organize o catalogo</h2>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  criado em {formatDate(category.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{category.partnerCount} parceiros</Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  Editar
                </Button>
              </div>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-white/70">{category.description}</p>
            )}
          </article>
        ))}
      </div>
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
