import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageCircle, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PartnerSummary } from "@/lib/data/partners";
import { getWhatsAppLink } from "@/lib/whatsapp";

type PartnerCardProps = {
  partner: PartnerSummary;
  className?: string;
  compact?: boolean;
};

export function PartnerCard({ partner, className, compact = false }: PartnerCardProps) {
  const whatsappHref = getWhatsAppLink(partner.whatsappNumber, "partner");

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[var(--shadow-raised)]",
        className,
      )}
    >
      <Link href={`/parceiros/${partner.slug}`} className={cn("relative flex items-center justify-center overflow-hidden bg-[var(--color-surface-warm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-focus)]", compact ? "h-40" : "h-52 sm:h-56")}>
        <Image
          src={partner.logoUrl}
          alt={`Marca ${partner.name}`}
          fill
          className="object-contain p-8 transition duration-500 group-hover:scale-[1.045]"
          sizes={compact ? "270px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(117,11,42,0.12),transparent_58%,rgba(195,148,77,0.2))]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[var(--color-wine)] shadow-sm backdrop-blur">
          <Tag className="h-3 w-3" aria-hidden />
          {partner.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="pr-6 font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight text-[var(--color-text)]">
          <Link href={`/parceiros/${partner.slug}`} className="outline-offset-4 hover:text-[var(--color-wine)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]">
            {partner.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--color-text-muted)]">
          {partner.description ?? "Informações e canal de atendimento disponíveis no diretório."}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Link
            href={`/parceiros/${partner.slug}`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-wine)] bg-white px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Conhecer <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href={`/out/partner/${partner.slug}`}
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-wine)] px-3 text-xs font-bold text-white transition hover:bg-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Visitar <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 text-xs font-bold text-[#073B23] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Falar no WhatsApp <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
