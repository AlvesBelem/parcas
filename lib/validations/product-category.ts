import { z } from "zod";

export const createProductCategorySchema = z.object({
  name: z
    .string({ required_error: "Informe o nome da categoria de produto." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(80, "O nome pode ter no maximo 80 caracteres."),
  description: z
    .string()
    .max(160, "Use no maximo 160 caracteres.")
    .optional()
    .transform((value) => value?.trim())
    .or(z.literal("").transform(() => undefined)),
});

export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
