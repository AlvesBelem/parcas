import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageCircle, Wrench } from "lucide-react";

import type { ServiceSummary } from "@/lib/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

type ServiceCardProps = {
  service: ServiceSummary;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const image = service.imageUrl || "/logo_cpad_belem.svg";
  const whatsappHref = getWhatsAppLink(service.whatsappNumber, "service");
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-raised)]">
      <Link href={`/servicos/${service.slug}`} className="relative flex h-40 items-center justify-center bg-[var(--color-surface-warm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-focus)]">
        <Image src={image} alt={service.imageUrl ? service.name : "CPAD Belém"} fill className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-white/80 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[var(--color-wine)]"><Wrench className="h-3 w-3" aria-hidden />{service.category.name}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl leading-tight text-[var(--color-text)]"><Link href={`/servicos/${service.slug}`} className="hover:text-[var(--color-wine)]">{service.name}</Link></h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">{service.description ?? "Informações e canal de atendimento deste serviço."}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Link href={`/servicos/${service.slug}`} className="inline-flex min-h-10 items-center justify-center gap-1 text-xs font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-wine-dark)]">Detalhes <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></Link>
          <Link href={`/out/service/${service.slug}`} prefetch={false} className="inline-flex min-h-10 items-center justify-center gap-1 bg-[var(--color-wine)] px-3 text-xs font-bold text-white transition hover:bg-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">{service.ctaLabel || "Conhecer serviço"}<ExternalLink className="h-3.5 w-3.5" aria-hidden /></Link>
          {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="col-span-2 inline-flex min-h-10 items-center justify-center gap-1.5 bg-[#25D366] px-3 text-xs font-bold text-[#073B23] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">Falar no WhatsApp <MessageCircle className="h-3.5 w-3.5" aria-hidden /></a> : null}
        </div>
      </div>
    </article>
  );
}
