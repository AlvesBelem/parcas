"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createProductCategorySchema } from "@/lib/validations/product-category";
import type { FormActionState } from "@/lib/actions/form-action-state";

export async function createProductCategory(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para cadastrar categorias.",
    };
  }

  const parsed = createProductCategorySchema.safeParse({
    name: String(formData.get("name") || ""),
    description: formData.get("description")?.toString(),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  try {
    await prisma.productCategory.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        slug: slugify(parsed.data.name),
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      ok: true,
      message: "Categoria de produto cadastrada com sucesso!",
    };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe uma categoria com esse nome."
        : "Erro ao salvar categoria. Tente novamente.";

    return {
      ok: false,
      message,
    };
  }
}
