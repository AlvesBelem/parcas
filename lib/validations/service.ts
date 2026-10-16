import { z } from "zod";

import { isValidWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";

const optionalImage = z
  .string()
  .trim()
  .refine((value) => !value || value.startsWith("/") || /^https?:\/\//i.test(value), "Use uma URL HTTPS/HTTP ou caminho iniciado com /.")
  .optional()
  .transform((value) => value || undefined);

const optionalWhatsAppNumber = z
  .string()
  .optional()
  .transform(normalizeWhatsAppNumber)
  .refine(isValidWhatsAppNumber, "Informe o WhatsApp com DDI e DDD. Ex.: 5591999999999.");

export const serviceSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome do serviço.").max(160, "Use no máximo 160 caracteres."),
  categoryId: z.string().cuid("Selecione uma categoria válida."),
  url: z.string().trim().url("Use um link válido para o serviço."),
  whatsappNumber: optionalWhatsAppNumber,
  imageUrl: optionalImage,
  ctaLabel: z.string().trim().max(80, "Use no máximo 80 caracteres.").optional().transform((value) => value || "Conhecer serviço"),
  description: z.string().trim().max(3000, "Use no máximo 3000 caracteres.").optional().transform((value) => value || undefined),
});

export const serviceCategorySchema = z.object({
  name: z.string().trim().min(3, "Informe o nome da categoria.").max(80, "Use no máximo 80 caracteres."),
  description: z.string().trim().max(160, "Use no máximo 160 caracteres.").optional().transform((value) => value || undefined),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
