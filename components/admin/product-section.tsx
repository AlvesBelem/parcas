"use client";

import { useState } from "react";

import type { PartnerProductSummary } from "@/lib/data/products";
import type { ProductCategoryOption } from "@/lib/data/product-categories";
import { Button } from "@/components/ui/button";
import { AdminModal } from "@/components/admin/admin-modal";
import { ProductForm } from "@/components/admin/product-form";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { ProductGrid } from "@/components/admin/product-grid";

type ProductSectionProps = {
  products: PartnerProductSummary[];
  categories: ProductCategoryOption[];
};

export function ProductSection({ products, categories }: ProductSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerProductSummary | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#b02a20]/15 bg-white/80 p-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Monetização</p>
          <h2 className="text-2xl font-semibold text-[#2d1c16]">Produtos de parceiros</h2>
          <p className="text-sm text-neutral-600">
            Cadastre ofertas afiliadas e gerencie status, edição e exclusão em um lugar só.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          Cadastrar produto
        </Button>
      </div>

      <ProductGrid products={products} onEdit={setEditing} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <div className="rounded-full border border-[#b02a20]/15 bg-white px-4 py-3 shadow-[0_16px_50px_rgba(45,28,22,0.08)] backdrop-blur">
          <Button className="w-full" size="lg" onClick={() => setCreateOpen(true)}>
            + Cadastrar produto
          </Button>
        </div>
      </div>

      <AdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Cadastrar produto"
        description="Informe os dados oficiais do produto do parceiro."
      >
        <ProductForm categories={categories} />
      </AdminModal>

      <AdminModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Editar produto"
        description="Atualize os dados do produto e confirme a mudança."
      >
        {editing && (
          <ProductEditForm
            key={editing.id}
            product={editing}
            categories={categories}
            onSuccess={() => setEditing(null)}
          />
        )}
      </AdminModal>
    </section>
  );
}
