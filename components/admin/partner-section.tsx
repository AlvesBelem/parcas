"use client";

import { useState } from "react";
import { Plus, Store } from "lucide-react";

import type { PartnerSummary } from "@/lib/data/partners";
import type { CategoryOption } from "@/lib/data/categories";
import { AdminModal } from "@/components/admin/admin-modal";
import { PartnerEditForm } from "@/components/admin/partner-edit-form";
import { PartnerGrid } from "@/components/admin/partner-grid";
import { PartnerForm } from "@/components/partner-form";
import { Button } from "@/components/ui/button";
import { FeaturedBannerForm, type FeaturedBannerTargetInput } from "@/components/admin/featured-banner-form";
import type { FeaturedBannerSchedule } from "@/lib/data/featured-banners";

type PartnerSectionProps = {
  partners: PartnerSummary[];
  categories: CategoryOption[];
  featuredBanners: FeaturedBannerSchedule[];
};

export function PartnerSection({ partners, categories, featuredBanners }: PartnerSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerSummary | null>(null);
  const [bannerTarget, setBannerTarget] = useState<FeaturedBannerTargetInput | null>(null);
  const bannerSchedule = bannerTarget ? featuredBanners.find((banner) => banner.targetType === bannerTarget.targetType && banner.targetId === bannerTarget.targetId) : undefined;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-wine)]">Diretório público</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-[var(--color-text)] sm:text-5xl">Parceiros</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Cadastre, atualize ou suspenda os canais de atendimento apresentados na vitrine.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" aria-hidden /> Cadastrar parceiro</Button>
      </header>

      <div className="grid gap-4 border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="flex h-11 w-11 items-center justify-center border border-[var(--color-gold)] bg-white text-[var(--color-wine)]"><Store className="h-5 w-5" aria-hidden /></span>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]"><strong className="font-semibold text-[var(--color-text)]">{partners.length} registros carregados.</strong> A disponibilidade pública é controlada pelo status ativo de cada parceiro.</p>
      </div>

      <PartnerGrid partners={partners} onEdit={setEditingPartner} featuredBanners={featuredBanners} onFeature={(target) => setBannerTarget(target)} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <Button className="w-full shadow-[var(--shadow-raised)]" size="lg" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" aria-hidden /> Cadastrar parceiro</Button>
      </div>

      <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title="Cadastrar parceiro" description="Inclua somente informações confirmadas e o canal oficial informado pela empresa.">
        <PartnerForm categories={categories} />
      </AdminModal>
      <AdminModal open={Boolean(editingPartner)} onClose={() => setEditingPartner(null)} title="Editar parceiro" description="Revise os dados de exibição antes de salvar.">
        {editingPartner && <PartnerEditForm key={editingPartner.id} partner={editingPartner} categories={categories} onSuccess={() => setEditingPartner(null)} />}
      </AdminModal>
      <AdminModal open={Boolean(bannerTarget)} onClose={() => setBannerTarget(null)} title="Programar banner" description="Defina o período em que este parceiro terá destaque na abertura do catálogo.">
        {bannerTarget && <FeaturedBannerForm target={bannerTarget} schedule={bannerSchedule} onSuccess={() => setBannerTarget(null)} />}
      </AdminModal>
    </section>
  );
}
