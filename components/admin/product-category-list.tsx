"use client";

import type { ProductCategoryWithStats } from "@/lib/data/product-categories";
import { Badge } from "@/components/ui/badge";

type ProductCategoryListProps = {
  categories: ProductCategoryWithStats[];
};

export function ProductCategoryList({ categories }: ProductCategoryListProps) {
  if (!categories.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#b02a20]/25 bg-[#fff7f2] p-8 text-center text-sm text-neutral-700">
        Nenhuma categoria de produto cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-[#b02a20]/12 bg-white p-6 shadow-[0_12px_36px_rgba(45,28,22,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Categorias de produtos</p>
          <h2 className="text-xl font-semibold text-[#2d1c16]">Controle os grupos afiliados</h2>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-[#b02a20]/15 bg-[#fff7f2] p-4 text-[#2d1c16]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  criado em {formatDate(category.createdAt)}
                </p>
              </div>
              <Badge>{category.productCount} produtos</Badge>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-neutral-700">{category.description}</p>
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
