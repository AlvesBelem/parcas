"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power, Trash2 } from "lucide-react";

import type { PartnerSummary } from "@/lib/data/partners";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePartner, togglePartnerStatus } from "@/lib/actions/partner-actions";

type PartnerGridProps = {
  partners: PartnerSummary[];
  onEdit: (partner: PartnerSummary) => void;
};

export function PartnerGrid({ partners, onEdit }: PartnerGridProps) {
  if (!partners.length) {
    return (
      <Card className="border-dashed border-white/20 bg-black/20 text-center text-sm text-white/70">
        <CardContent className="p-6">
          Nenhum parceiro cadastrado ainda. O primeiro cadastro ja ocupa a vitrine principal.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-zinc-950/60">
      <CardHeader className="flex items-center justify-between gap-3">
        <div>
          <CardDescription className="uppercase tracking-[0.25em] text-xs text-white/50">
            Ultimos parceiros
          </CardDescription>
          <CardTitle className="text-2xl text-white">Publicados recentemente</CardTitle>
        </div>
        <Badge variant="outline">{partners.length}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {partners.map((partner) => (
          <article
            key={partner.id}
            className={`flex h-full min-h-[210px] flex-col rounded-2xl border ${partner.active ? "border-white/10 bg-black/30" : "border-red-500/30 bg-black/20"} p-4 text-white shadow-lg shadow-black/20`}
          >
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
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
                  {!partner.active && (
                    <Badge variant="outline" className="text-red-300">
                      Inativo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 line-clamp-2">
                  {partner.description ??
                    "Sem descricao cadastrada. Atualize o parceiro para adicionar um texto curto."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => onEdit(partner)}
                  aria-label={`Editar ${partner.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <form action={togglePartnerStatus}>
                  <input type="hidden" name="partnerId" value={partner.id} />
                  <input
                    type="hidden"
                    name="nextStatus"
                    value={(!partner.active).toString()}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className={
                      partner.active
                        ? "text-white/70 hover:border-red-400 hover:text-red-200"
                        : "text-lime-200 hover:border-lime-200 hover:text-lime-100"
                    }
                    aria-label={`${partner.active ? "Desativar" : "Reativar"} ${partner.name}`}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </form>
                <form action={deletePartner}>
                  <input type="hidden" name="partnerId" value={partner.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-red-300 hover:border-red-400 hover:text-red-100"
                    onClick={(event) => {
                      if (
                        !confirm(
                          `Deseja excluir o parceiro "${partner.name}"? Essa acao nao pode ser desfeita.`,
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                    aria-label={`Excluir ${partner.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-white/40">
              <span>cadastrado em {formatDate(partner.createdAt)}</span>
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
          </article>
        ))}
      </CardContent>
    </Card>
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
