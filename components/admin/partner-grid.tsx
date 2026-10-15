"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power, Trash2 } from "lucide-react";

import type { PartnerSummary } from "@/lib/data/partners";
import { deletePartner, togglePartnerStatus } from "@/lib/actions/partner-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PartnerGridProps = {
  partners: PartnerSummary[];
  onEdit: (partner: PartnerSummary) => void;
};

export function PartnerGrid({ partners, onEdit }: PartnerGridProps) {
  if (!partners.length) {
    return <EmptyState text="Ainda não há parceiros cadastrados. Quando houver um cadastro ativo, ele poderá aparecer na vitrine pública." />;
  }

  return (
    <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="partners-list-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Registros</p>
          <h2 id="partners-list-title" className="mt-1 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Lojas cadastradas</h2>
        </div>
        <Badge variant="outline">{partners.length} itens</Badge>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {partners.map((partner) => (
          <article key={partner.id} className="grid gap-4 p-5 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
            <div className="relative h-16 w-16 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
              <Image src={partner.logoUrl} alt={`Marca ${partner.name}`} fill className="object-contain p-2" sizes="64px" unoptimized />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl leading-tight text-[var(--color-text)]">{partner.name}</h3>
                <Badge>{partner.category}</Badge>
                <Badge variant="outline">{partner.active ? "Ativo" : "Pausado"}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">{partner.description ?? "Sem descrição cadastrada."}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-subtle)]">
                <span>Cadastrado em {formatDate(partner.createdAt)}</span>
                <span>{partner.clickCount} cliques externos registrados</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(partner)}><Pencil className="h-3.5 w-3.5" aria-hidden /> Editar</Button>
              <form action={togglePartnerStatus}>
                <input type="hidden" name="partnerId" value={partner.id} />
                <input type="hidden" name="nextStatus" value={(!partner.active).toString()} />
                <Button type="submit" variant="ghost" size="sm" className="border border-[var(--color-border)]"><Power className="h-3.5 w-3.5" aria-hidden /> {partner.active ? "Pausar" : "Ativar"}</Button>
              </form>
              <form action={deletePartner}>
                <input type="hidden" name="partnerId" value={partner.id} />
                <Button type="submit" variant="ghost" size="icon" className="border border-[var(--color-border)] text-[var(--color-wine)] hover:bg-red-50" aria-label={`Excluir ${partner.name}`} onClick={(event) => { if (!confirm(`Deseja excluir o parceiro “${partner.name}”? Essa ação não pode ser desfeita.`)) event.preventDefault(); }}><Trash2 className="h-4 w-4" aria-hidden /></Button>
              </form>
              <Link href={partner.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center gap-1.5 border border-[var(--color-wine)] px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">Abrir <ExternalLink className="h-3.5 w-3.5" aria-hidden /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-9 text-center text-sm leading-6 text-[var(--color-text-muted)]">{text}</div>;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}
