import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PartnerSummary } from "@/lib/data/partners";

type PartnerCardProps = {
  partner: PartnerSummary;
  className?: string;
  compact?: boolean;
};

export function PartnerCard({ partner, className, compact = false }: PartnerCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)]",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden bg-[var(--color-surface-warm)]", compact ? "h-28" : "h-36")}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(117,11,42,0.12),transparent_58%,rgba(195,148,77,0.2))]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-white/65 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[var(--color-wine)] shadow-sm backdrop-blur">
          <Tag className="h-3 w-3" aria-hidden />
          {partner.category}
        </span>
      </div>

      <div className={cn("relative flex flex-1 flex-col px-5 pb-5", compact ? "pt-9" : "pt-11")}>
        <div className={cn("absolute left-5 flex items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_8px_22px_rgba(58,35,25,0.12)]", compact ? "-top-9 h-16 w-16" : "-top-11 h-20 w-20")}>
          <Image
            src={partner.logoUrl}
            alt={`Marca ${partner.name}`}
            fill
            className="object-contain p-2"
            sizes={compact ? "64px" : "80px"}
            unoptimized
          />
        </div>

        <h3 className="pr-6 font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight text-[var(--color-text)]">
          <Link href={`/parceiros/${partner.slug}`} className="outline-offset-4 hover:text-[var(--color-wine)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]">
            {partner.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--color-text-muted)]">
          {partner.description ?? "Informações e canal de atendimento disponíveis no diretório."}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Link
            href={`/parceiros/${partner.slug}`}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-[var(--color-wine)] px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Conhecer <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href={`/out/partner/${partner.slug}`}
            prefetch={false}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 bg-[var(--color-wine)] px-3 text-xs font-bold text-white transition hover:bg-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Visitar <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
