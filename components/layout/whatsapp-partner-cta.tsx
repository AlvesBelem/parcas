"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const partnerMessage = "Quero me tornar um parceiro, como funciona?";

export function WhatsAppPartnerCta() {
  const pathname = usePathname();

  if (!isPublicCatalogRoute(pathname)) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/55919991271407?text=${encodeURIComponent(partnerMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-partner-cta group fixed bottom-5 right-4 z-40 inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] py-2.5 pl-4 pr-3 text-sm font-extrabold text-[#103e24] shadow-[0_12px_28px_rgba(20,116,63,0.34)] transition duration-200 hover:-translate-y-1 hover:bg-[#22c55e] hover:shadow-[0_18px_34px_rgba(20,116,63,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
      aria-label="Falar no WhatsApp sobre parceria com a CPAD Belém"
    >
      <span className="whitespace-nowrap">Quer ser um parceiro?</span>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#20a958] transition group-hover:scale-105" aria-hidden>
        <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
      </span>
    </a>
  );
}

function isPublicCatalogRoute(pathname: string) {
  return ["/", "/parceiros", "/produtos", "/servicos", "/seja-um-parceiro"].some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}
