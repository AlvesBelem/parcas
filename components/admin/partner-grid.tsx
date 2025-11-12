"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power } from "lucide-react";

import type { PartnerSummary } from "@/lib/data/partners";
import { Badge } from "@/components/ui/badge";
import { togglePartnerStatus } from "@/lib/actions/partner-actions";

type PartnerGridProps = {
  partners: PartnerSummary[];
  onEdit: (partner: PartnerSummary) => void;
};

export function PartnerGrid({ partners, onEdit }: PartnerGridProps) {
  if (!partners.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-black/20 p-8 text-center text-sm text-white/70">
        Nenhum parceiro cadastrado ainda. O primeiro cadastro ja ocupa a vitrine principal.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Ultimos parceiros
          </p>
          <h2 className="text-2xl font-semibold text-white">Publicados recentemente</h2>
        </div>
        <Badge variant="outline">{partners.length}</Badge>
      </div>

      <div className="space-y-4">
        {partners.map((partner) => (
          <article
            key={partner.id}
            className={`rounded-2xl border ${partner.active ? "border-white/10 bg-black/30" : "border-red-500/30 bg-black/20"} p-4 text-white`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white p-2">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{partner.name}</h3>
                  <Badge>{partner.category}</Badge>
                </div>
                <p className="text-sm text-white/70">
                  {partner.description ??
                    "Sem descricao cadastrada. Atualize o parceiro para adicionar um texto curto."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(partner)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/50 hover:text-white"
                  aria-label={`Editar ${partner.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <form action={togglePartnerStatus}>
                  <input type="hidden" name="partnerId" value={partner.id} />
                  <input
                    type="hidden"
                    name="nextStatus"
                    value={(!partner.active).toString()}
                  />
                  <button
                    type="submit"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${partner.active ? "border-white/10 text-white/70 hover:border-red-400 hover:text-red-400" : "border-lime-300/40 text-lime-200 hover:border-lime-200 hover:text-lime-100"}`}
                    aria-label={`${partner.active ? "Desativar" : "Reativar"} ${partner.name}`}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-white/40">
              <span>cadastrado em {formatDate(partner.createdAt)}</span>
              <div className="flex items-center gap-3">
                {!partner.active && (
                  <Badge variant="outline" className="text-red-300">
                    Inativo
                  </Badge>
                )}
                <Link
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-lime-200 hover:text-lime-100"
                >
                  Ver loja
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
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
