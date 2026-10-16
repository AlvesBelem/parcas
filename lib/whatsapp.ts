export type WhatsAppContext = "partner" | "product" | "service";

const BRAZIL_DDI = "55";

const messages: Record<WhatsAppContext, string> = {
  partner: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre sua loja.",
  product: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre este produto.",
  service: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre este serviço.",
};

export function normalizeWhatsAppNumber(value: string | null | undefined) {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (!digits) return undefined;

  // Mantém compatibilidade com números que possam ter sido salvos com o DDI.
  return digits.startsWith(BRAZIL_DDI) && /^55\d{10,11}$/.test(digits)
    ? digits.slice(BRAZIL_DDI.length)
    : digits;
}

export function isValidWhatsAppNumber(value: string | undefined) {
  return !value || /^\d{10,11}$/.test(value);
}

export function getWhatsAppLink(number: string | null | undefined, context: WhatsAppContext) {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  if (!normalizedNumber || !isValidWhatsAppNumber(normalizedNumber)) return null;

  return `https://wa.me/${BRAZIL_DDI}${normalizedNumber}?text=${encodeURIComponent(messages[context])}`;
}
