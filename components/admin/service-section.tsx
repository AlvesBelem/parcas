"use client";

import { useState } from "react";
import { FolderPlus, Plus, Wrench } from "lucide-react";

import type { ServiceCategoryOption, ServiceSummary } from "@/lib/data/services";
import type { FeaturedBannerSchedule } from "@/lib/data/featured-banners";
import { AdminModal } from "@/components/admin/admin-modal";
import { FeaturedBannerForm, type FeaturedBannerTargetInput } from "@/components/admin/featured-banner-form";
import { ServiceCategoryForm } from "@/components/admin/service-category-form";
import { ServiceEditForm, ServiceForm } from "@/components/admin/service-form";
import { ServiceGrid } from "@/components/admin/service-grid";
import { Button } from "@/components/ui/button";

export function ServiceSection({
  services,
  categories,
  featuredBanners,
}: {
  services: ServiceSummary[];
  categories: ServiceCategoryOption[];
  featuredBanners: FeaturedBannerSchedule[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceSummary | null>(null);
  const [bannerTarget, setBannerTarget] = useState<FeaturedBannerTargetInput | null>(null);
  const bannerSchedule = bannerTarget ? featuredBanners.find((banner) => banner.targetType === bannerTarget.targetType && banner.targetId === bannerTarget.targetId) : undefined;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-wine)]">Catálogo de atendimento</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-[var(--color-text)] sm:text-5xl">Serviços</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Cadastre serviços em categorias próprias e apresente apenas o canal oficial de atendimento.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="secondary" onClick={() => setCategoryOpen(true)}><FolderPlus className="h-4 w-4" aria-hidden />Categorias</Button>
          <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" aria-hidden />Cadastrar serviço</Button>
        </div>
      </header>
      <div className="grid gap-4 border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="flex h-11 w-11 items-center justify-center border border-[var(--color-gold)] bg-white text-[var(--color-wine)]"><Wrench className="h-5 w-5" aria-hidden /></span>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]"><strong className="font-semibold text-[var(--color-text)]">{services.length} serviços e {categories.length} categorias carregados.</strong> Uma categoria é obrigatória para publicar um serviço.</p>
      </div>
      <ServiceGrid services={services} onEdit={setEditing} featuredBanners={featuredBanners} onFeature={(target) => setBannerTarget(target)} />
      <div className="sticky bottom-4 z-10 lg:hidden"><Button className="w-full shadow-[var(--shadow-raised)]" size="lg" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" aria-hidden />Cadastrar serviço</Button></div>
      <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title="Cadastrar serviço" description="Inclua uma categoria e o canal de atendimento oficial."><ServiceForm categories={categories} onSuccess={() => setCreateOpen(false)} /></AdminModal>
      <AdminModal open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar serviço" description="Revise os dados antes de salvar.">{editing && <ServiceEditForm service={editing} categories={categories} onSuccess={() => setEditing(null)} />}</AdminModal>
      <AdminModal open={categoryOpen} onClose={() => setCategoryOpen(false)} title="Nova categoria de serviço" description="Exemplos: Casa e lar, Consultoria, Tecnologia, Eventos."><ServiceCategoryForm onSuccess={() => setCategoryOpen(false)} /></AdminModal>
      <AdminModal open={Boolean(bannerTarget)} onClose={() => setBannerTarget(null)} title="Programar banner" description="Defina o período em que este serviço terá destaque na abertura do catálogo.">
        {bannerTarget && <FeaturedBannerForm target={bannerTarget} schedule={bannerSchedule} onSuccess={() => setBannerTarget(null)} />}
      </AdminModal>
    </section>
  );
}
