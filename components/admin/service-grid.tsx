"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power, Sparkles, Trash2 } from "lucide-react";

import { deleteService, toggleServiceStatus } from "@/lib/actions/service-actions";
import type { FeaturedBannerTargetInput } from "@/components/admin/featured-banner-form";
import type { ServiceSummary } from "@/lib/data/services";
import type { FeaturedBannerSchedule } from "@/lib/data/featured-banners";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServiceGrid({
  services,
  onEdit,
  featuredBanners,
  onFeature,
}: {
  services: ServiceSummary[];
  onEdit: (service: ServiceSummary) => void;
  featuredBanners: FeaturedBannerSchedule[];
  onFeature: (target: FeaturedBannerTargetInput, schedule?: FeaturedBannerSchedule) => void;
}) {
  if (!services.length) {
    return <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-9 text-center text-sm text-[var(--color-text-muted)]">Ainda não há serviços cadastrados.</div>;
  }

  return (
    <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Registros</p>
          <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Serviços cadastrados</h2>
        </div>
        <Badge variant="outline">{services.length} itens</Badge>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {services.map((service) => {
          const bannerSchedule = featuredBanners.find((banner) => banner.targetType === "SERVICE" && banner.targetId === service.id);
          return (
            <article key={service.id} className="grid gap-4 p-5 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
              <div className="relative h-16 w-16 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                <Image src={service.imageUrl || "/logo_cpad_belem.svg"} alt={service.imageUrl ? service.name : "CPAD Belém"} fill className="object-contain p-2" sizes="64px" unoptimized />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">{service.name}</h3>
                  <Badge>{service.category.name}</Badge>
                  <Badge variant="outline">{service.active ? "Ativo" : "Pausado"}</Badge>
                  {bannerSchedule ? <Badge className="border-[var(--color-gold)] bg-[var(--color-surface-warm)] text-[var(--color-wine)]">No banner</Badge> : null}
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">{service.description ?? "Sem descrição cadastrada."}</p>
                <div className="mt-3 text-xs text-[var(--color-text-subtle)]">{service.clickCount} cliques externos registrados</div>
              </div>
              <div className="admin-list-actions flex flex-wrap gap-2 xl:justify-end">
                <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(service)}><Pencil className="h-3.5 w-3.5" aria-hidden />Editar</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => onFeature({ targetType: "SERVICE", targetId: service.id, name: service.name }, bannerSchedule)} disabled={!service.active && !bannerSchedule}><Sparkles className="h-3.5 w-3.5" aria-hidden />{bannerSchedule ? "Banner agendado" : "Adicionar ao banner"}</Button>
                <form action={toggleServiceStatus}>
                  <input type="hidden" name="serviceId" value={service.id} />
                  <input type="hidden" name="nextStatus" value={(!service.active).toString()} />
                  <Button type="submit" variant="ghost" size="sm" className="border border-[var(--color-border)]"><Power className="h-3.5 w-3.5" aria-hidden />{service.active ? "Pausar" : "Ativar"}</Button>
                </form>
                <form action={deleteService}>
                  <input type="hidden" name="serviceId" value={service.id} />
                  <Button type="submit" variant="ghost" size="icon" className="border border-[var(--color-border)] text-[var(--color-wine)] hover:bg-red-50" aria-label={`Excluir ${service.name}`} onClick={(event) => { if (!confirm(`Deseja excluir o serviço “${service.name}”? Essa ação não pode ser desfeita.`)) event.preventDefault(); }}><Trash2 className="h-4 w-4" aria-hidden /></Button>
                </form>
                <Link href={service.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center gap-1 border border-[var(--color-wine)] px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white">Abrir<ExternalLink className="h-3.5 w-3.5" aria-hidden /></Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
