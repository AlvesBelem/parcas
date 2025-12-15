"use client";

import { useState } from "react";

import type { PartnerProductSummary } from "@/lib/data/products";
import type { ProductCategoryOption } from "@/lib/data/product-categories";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/admin/product-grid";
import { ProductForm } from "@/components/admin/product-form";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { AdminModal } from "@/components/admin/admin-modal";

type ProductSectionProps = {
  products: PartnerProductSummary[];
  categories: ProductCategoryOption[];
};

export function ProductSection({ products, categories }: ProductSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PartnerProductSummary | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#eaded5] bg-white p-5 shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#b02b24]">Ofertas oficiais</p>
          <h2 className="text-2xl font-semibold text-[#2f1d15]">Produtos afiliados</h2>
          <p className="text-sm text-[#7a5a4b]">
            Inclua links auditados, banners e descrições alinhadas à vitrine CPAD.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          Cadastrar produto
        </Button>
      </div>

      <ProductGrid products={products} onEdit={setEditingProduct} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <div className="rounded-full border border-[#eaded5] bg-white px-4 py-3 shadow-[0_18px_55px_rgba(63,33,25,0.12)] backdrop-blur">
          <Button className="w-full" size="lg" onClick={() => setCreateOpen(true)}>
            + Cadastrar produto
          </Button>
        </div>
      </div>

      <AdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Cadastrar produto"
        description="Cadastre imagens, link oficial e selecione a categoria para filtrar na vitrine."
      >
        <ProductForm categories={categories} />
      </AdminModal>

      <AdminModal
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="Editar produto"
        description="Atualize dados e mantenha a cara do site principal."
      >
        {editingProduct && (
          <ProductEditForm
            key={editingProduct.id}
            product={editingProduct}
            categories={categories}
            onSuccess={() => setEditingProduct(null)}
          />
        )}
      </AdminModal>
    </section>
  );
}
