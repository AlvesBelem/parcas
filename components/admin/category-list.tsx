"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { AdminCategoryEntry } from "@/lib/data/categories";
import { deleteCategory } from "@/lib/actions/category-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CategoryListProps = {
  categories: AdminCategoryEntry[];
  onEdit: (category: AdminCategoryEntry) => void;
};

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  if (!categories.length) return <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-9 text-center text-sm leading-6 text-[var(--color-text-muted)]">Nenhuma categoria foi cadastrada ainda.</div>;

  return (
    <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="category-list-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Registros</p>
          <h2 id="category-list-title" className="mt-1 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Categorias configuradas</h2>
        </div>
        <Badge variant="outline">{categories.length} itens</Badge>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {categories.map((category) => (
          <article key={category.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">{category.name}</h3>
                <Badge variant="outline">{scopeLabel(category.scope)}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{category.description ?? "Sem descrição cadastrada."}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-subtle)]"><span>{category.partnerCount} parceiros</span><span>{category.productCount} produtos</span><span>Criada em {formatDate(category.createdAt)}</span></div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(category)} disabled={!category.partnerId && !category.productCategoryId}><Pencil className="h-3.5 w-3.5" aria-hidden /> Editar</Button>
              <form action={deleteCategory}>
                {category.partnerId && <input type="hidden" name="categoryId" value={category.partnerId} />}
                {category.productCategoryId && <input type="hidden" name="productCategoryId" value={category.productCategoryId} />}
                <Button type="submit" variant="ghost" size="sm" className="border border-[var(--color-border)] text-[var(--color-wine)] hover:bg-red-50" onClick={(event) => { if (!confirm(`Deseja excluir a categoria “${category.name}”? Essa ação não pode ser desfeita.`)) event.preventDefault(); }}><Trash2 className="h-3.5 w-3.5" aria-hidden /> Excluir</Button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function scopeLabel(scope: AdminCategoryEntry["scope"]) {
  if (scope === "both") return "Parceiros e produtos";
  return scope === "partners" ? "Parceiros" : "Produtos";
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}
