import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Informe o nome da categoria." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(60, "O nome pode ter no maximo 60 caracteres."),
  description: z
    .string()
    .max(160, "Use no maximo 160 caracteres.")
    .optional()
    .transform((value) => value?.trim())
    .or(z.literal("").transform(() => undefined)),
  scope: z.enum(["partners", "products", "both"], {
    required_error: "Selecione onde a categoria sera usada.",
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
