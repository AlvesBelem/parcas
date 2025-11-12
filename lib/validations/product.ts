import { z } from "zod";

const priceSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Informe o preco no formato 0.00")
  .transform((value) => value || undefined)
  .optional();

const imageSchema = z
  .array(
    z
      .string()
      .min(2, "Informe o link da imagem.")
      .refine(isValidImageSource, {
        message:
          "Use um link HTTPS completo ou um caminho relativo iniciado com / apontando para a pasta public.",
      }),
  )
  .min(1, "Informe pelo menos uma imagem.")
  .max(5, "Use no maximo 5 imagens.");

export const createProductSchema = z.object({
  name: z
    .string({ required_error: "Informe o nome do produto." })
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(160, "O nome pode ter no maximo 160 caracteres."),
  categoryId: z
    .string({ required_error: "Selecione a categoria." })
    .cuid("Selecione uma categoria valida."),
  platform: z
    .string({ required_error: "Informe a plataforma." })
    .min(2, "A plataforma deve ter pelo menos 2 caracteres.")
    .max(80, "A plataforma pode ter no maximo 80 caracteres."),
  url: z
    .string({ required_error: "Informe o link do produto." })
    .url("Use um link valido para o produto."),
  imageUrls: imageSchema,
  price: priceSchema,
  description: z
    .string()
    .max(3000, "Use no maximo 3000 caracteres.")
    .optional()
    .transform((value) => value?.trim())
    .or(z.literal("").transform(() => undefined)),
});

export const updateProductSchema = createProductSchema.extend({
  productId: z
    .string({ required_error: "Produto invalido." })
    .cuid("Selecione um produto valido."),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

function isValidImageSource(value: string) {
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
