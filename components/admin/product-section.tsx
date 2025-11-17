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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Monetizacao</p>
          <h2 className="text-2xl font-semibold text-white">Produtos de parceiros</h2>
          <p className="text-sm text-white/60">
            Cadastre ofertas afiliadas e gerencie status, edicao e exclusao em um lugar so.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Cadastrar produto</Button>
      </div>

      <ProductGrid products={products} onEdit={setEditing} />

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
        description="Atualize os dados do produto e confirme a mudanca."
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
