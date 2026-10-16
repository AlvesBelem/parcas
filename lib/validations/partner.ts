import { z } from "zod";

import { isValidWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { isSafeExternalUrl, isSafeImageSource } from "@/lib/url-security";

const optionalWhatsAppNumber = z
  .string()
  .optional()
  .transform(normalizeWhatsAppNumber)
  .refine(isValidWhatsAppNumber, "Informe o WhatsApp com DDD. Ex.: 91999999999.");

export const createPartnerSchema = z.object({
  name: z
    .string({ required_error: "Informe o nome da loja." })
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome pode ter no maximo 120 caracteres."),
  categoryId: z
    .string({ required_error: "Selecione uma categoria." })
    .cuid("Selecione uma categoria valida."),
  url: z
    .string({ required_error: "Informe o link da loja." })
    .url("Use um link valido para a loja parceira.")
    .refine(isSafeExternalUrl, "Use um link HTTP ou HTTPS valido para a loja parceira."),
  whatsappNumber: optionalWhatsAppNumber,
  logoUrl: z
    .string({ required_error: "Informe o caminho ou link da foto." })
    .min(2, "Informe o caminho ou link completo da imagem.")
    .refine(isSafeImageSource, {
      message:
        "Use um link HTTPS completo ou um caminho local iniciado com / apontando para a pasta public.",
    }),
  description: z
    .string()
    .max(240, "Use no maximo 240 caracteres.")
    .optional()
    .transform((value) => value?.trim())
    .or(z.literal("").transform(() => undefined)),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;

export const updatePartnerSchema = createPartnerSchema.extend({
  partnerId: z.string({ required_error: "Parceiro invalido." }).cuid("Selecione um parceiro valido."),
});

export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
