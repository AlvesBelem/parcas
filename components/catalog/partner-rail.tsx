import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import type { PartnerSummary } from "@/lib/data/partners";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PartnerRailProps = {
  title: string;
  partners: PartnerSummary[];
};

export function PartnerRail({ title, partners }: PartnerRailProps) {
  if (!partners.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </h3>
        <Badge variant="outline">{partners.length}</Badge>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {partners.map((partner) => (
            <article
              key={partner.id}
              className="relative w-[260px] shrink-0 overflow-hidden rounded-3xl border border-[#eaded5] bg-white shadow-[0_14px_44px_rgba(63,33,25,0.1)] transition hover:-translate-y-1"
            >
              <div className="relative h-48 w-full bg-[#fff8f3]">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  className="object-contain p-8"
                  sizes="260px"
                  unoptimized
                />
              </div>
              <div className="space-y-2 p-4 text-[#3f2b22]">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-lg font-semibold truncate">{partner.name}</h4>
                  <Badge>{partner.category}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-[#7a5a4b]">
                  {partner.description ?? "Parceiro oficial com suporte direto da CPAD Belém."}
                </p>
                <div className="flex items-center justify-between text-xs text-[#a38271]">
                  <span>{new Intl.DateTimeFormat("pt-BR").format(new Date(partner.createdAt))}</span>
                  <span>{partner.clickCount} cliques</span>
                </div>
                <PartnerLinkButton partner={partner} />
              </div>
            </article>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

function PartnerLinkButton({ partner }: { partner: PartnerSummary }) {
  const partnerLink = partner.url || `/out/partner/${partner.slug}`;
  const isExternal = partnerLink.startsWith("http");

  return (
    <Link
      href={partnerLink}
      prefetch={false}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b02b24] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(178,45,38,0.2)] hover:bg-[#8f1f19]"
      )}
    >
      Visitar site
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}
