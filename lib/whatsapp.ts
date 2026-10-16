export type WhatsAppContext = "partner" | "product" | "service";

const messages: Record<WhatsAppContext, string> = {
  partner: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre sua loja.",
  product: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre este produto.",
  service: "Olá! Vim da plataforma de parceiros da CPAD Belém e quero saber mais sobre este serviço.",
};

export function normalizeWhatsAppNumber(value: string | null | undefined) {
  const digits = value?.replace(/\D/g, "") ?? "";
  return digits || undefined;
}

export function isValidWhatsAppNumber(value: string | undefined) {
  return !value || /^\d{10,15}$/.test(value);
}

export function getWhatsAppLink(number: string | null | undefined, context: WhatsAppContext) {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  if (!normalizedNumber || !isValidWhatsAppNumber(normalizedNumber)) return null;

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(messages[context])}`;
}
