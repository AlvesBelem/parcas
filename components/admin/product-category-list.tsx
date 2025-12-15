"use client";

import type { ProductCategoryWithStats } from "@/lib/data/product-categories";
import { Badge } from "@/components/ui/badge";

type ProductCategoryListProps = {
  categories: ProductCategoryWithStats[];
};

export function ProductCategoryList({ categories }: ProductCategoryListProps) {
  if (!categories.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#eaded5] bg-[#fff8f3] p-8 text-center text-sm text-[#7a5a4b]">
        Nenhuma categoria de produto cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-[#eaded5] bg-white p-6 shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#b02b24]">Categorias de produtos</p>
          <h2 className="text-xl font-semibold text-[#2f1d15]">Controle os grupos afiliados</h2>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-[#eaded5] bg-[#fff8f3] p-4 text-[#3f2b22] shadow-[0_10px_30px_rgba(63,33,25,0.06)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#2f1d15]">{category.name}</h3>
                <p className="text-xs uppercase tracking-wide text-[#a38271]">
                  criado em {formatDate(category.createdAt)}
                </p>
              </div>
              <Badge>{category.productCount} produtos</Badge>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-[#7a5a4b]">{category.description}</p>
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
