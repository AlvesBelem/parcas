"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PartnerSummary } from "@/lib/data/partners";

type PartnerCardProps = {
  partner: PartnerSummary;
  className?: string;
};

export function PartnerCard({ partner, className }: PartnerCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col border border-[#eaded5] bg-white text-[#3f2b22] shadow-[0_12px_35px_rgba(63,33,25,0.08)]",
        className,
      )}
    >
      <CardHeader className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-[#f3e7de] bg-[#fff8f3] p-2 sm:mx-0">
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              fill
              className="object-contain"
              sizes="80px"
              unoptimized
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl text-[#2f1d15]">{partner.name}</CardTitle>
            <Badge className="mx-auto sm:mx-0">{partner.category}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-[#b02b24] sm:justify-start">
          <ShieldCheck className="h-4 w-4" />
          Parceiro verificado
        </div>
        <CardDescription className="text-[#7a5a4b] text-center sm:text-left">
          {partner.description ??
            "Parceiro oficial credenciado e pronto para atender voce com seguranca."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm text-[#7a5a4b] text-center sm:text-left">
          <li>
            <span className="text-[#2f1d15]">Disponivel 24/7</span> com suporte dedicado.
          </li>
          <li>Entrega segura e monitorada pela equipe CPAD Belem.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
