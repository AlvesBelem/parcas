"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        "flex h-full flex-col border border-white/10 bg-black/80 text-white shadow-[0_0_50px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <CardHeader className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white p-2 sm:mx-0">
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
            <CardTitle className="text-xl text-white">{partner.name}</CardTitle>
            <Badge className="mx-auto sm:mx-0">{partner.category}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-lime-200 sm:justify-start">
          <ShieldCheck className="h-4 w-4" />
          Parceiro verificado
        </div>
        <CardDescription className="text-white/80 text-center sm:text-left">
          {partner.description ?? "Parceiro oficial credenciado e pronto para atender você sem golpes."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm text-white/70 text-center sm:text-left">
          <li>
            <span className="text-white">Disponível 24/7</span> com suporte dedicado.
          </li>
          <li>Entrega segura e monitorada por nossa equipe.</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={partner.url} target="_blank" rel="noopener noreferrer">
            Visitar loja
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
