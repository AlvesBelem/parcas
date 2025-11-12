import { z } from "zod";

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
    .url("Use um link valido para a loja parceira."),
  logoUrl: z
    .string({ required_error: "Informe o caminho ou link da foto." })
    .min(2, "Informe o caminho ou link completo da imagem.")
    .refine(isValidLogoSource, {
      message:
        "Use um link HTTPS completo ou um caminho relativo iniciado com / apontando para a pasta public.",
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

function isValidLogoSource(value: string) {
  if (value.startsWith("/")) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
