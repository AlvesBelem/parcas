"use client";

import { useState } from "react";
import { PackagePlus, PackageSearch } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import type { ProductCategoryOption } from "@/lib/data/product-categories";
import { AdminModal } from "@/components/admin/admin-modal";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { ProductForm } from "@/components/admin/product-form";
import { ProductGrid } from "@/components/admin/product-grid";
import { Button } from "@/components/ui/button";
import { FeaturedBannerForm, type FeaturedBannerTargetInput } from "@/components/admin/featured-banner-form";
import type { FeaturedBannerSchedule } from "@/lib/data/featured-banners";

type ProductSectionProps = {
  products: PartnerProductSummary[];
  categories: ProductCategoryOption[];
  featuredBanners: FeaturedBannerSchedule[];
};

export function ProductSection({ products, categories, featuredBanners }: ProductSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PartnerProductSummary | null>(null);
  const [bannerTarget, setBannerTarget] = useState<FeaturedBannerTargetInput | null>(null);
  const bannerSchedule = bannerTarget ? featuredBanners.find((banner) => banner.targetType === bannerTarget.targetType && banner.targetId === bannerTarget.targetId) : undefined;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-wine)]">Catálogo legado</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-[var(--color-text)] sm:text-5xl">Produtos</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Organize os itens publicados e seus links externos. A associação de produto com parceiro será tratada na próxima migração de dados.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto"><PackagePlus className="h-4 w-4" aria-hidden /> Cadastrar produto</Button>
      </header>

      <div className="grid gap-4 border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="flex h-11 w-11 items-center justify-center border border-[var(--color-gold)] bg-white text-[var(--color-wine)]"><PackageSearch className="h-5 w-5" aria-hidden /></span>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]"><strong className="font-semibold text-[var(--color-text)]">{products.length} itens carregados.</strong> Publique somente links, descrições e imagens que possam ser confirmados pela equipe.</p>
      </div>

      <ProductGrid products={products} onEdit={setEditingProduct} featuredBanners={featuredBanners} onFeature={(target) => setBannerTarget(target)} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <Button className="w-full shadow-[var(--shadow-raised)]" size="lg" onClick={() => setCreateOpen(true)}><PackagePlus className="h-4 w-4" aria-hidden /> Cadastrar produto</Button>
      </div>

      <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title="Cadastrar produto" description="Inclua imagens, o link externo e a categoria do item.">
        <ProductForm categories={categories} />
      </AdminModal>
      <AdminModal open={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} title="Editar produto" description="Revise os dados e confirme para salvar.">
        {editingProduct && <ProductEditForm key={editingProduct.id} product={editingProduct} categories={categories} onSuccess={() => setEditingProduct(null)} />}
      </AdminModal>
      <AdminModal open={Boolean(bannerTarget)} onClose={() => setBannerTarget(null)} title="Programar banner" description="Defina o período em que este produto terá destaque na abertura do catálogo.">
        {bannerTarget && <FeaturedBannerForm target={bannerTarget} schedule={bannerSchedule} onSuccess={() => setBannerTarget(null)} />}
      </AdminModal>
    </section>
  );
}
