"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/lib/validations/category";
import type { FormActionState } from "@/lib/actions/form-action-state";

export async function createCategory(
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

  const parsed = createCategorySchema.safeParse(extractFormValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const includePartners = parsed.data.scope === "partners" || parsed.data.scope === "both";
  const includeProducts = parsed.data.scope === "products" || parsed.data.scope === "both";
  const slug = slugify(parsed.data.name);
  const operations: Promise<unknown>[] = [];

  if (includePartners) {
    operations.push(
      prisma.category.upsert({
        where: { slug },
        create: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description,
        },
        update: {
          name: parsed.data.name,
          description: parsed.data.description,
        },
      }),
    );
  }

  if (includeProducts) {
    operations.push(
      prisma.productCategory.upsert({
        where: { slug },
        create: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description,
        },
        update: {
          name: parsed.data.name,
          description: parsed.data.description,
        },
      }),
    );
  }

  try {
    await Promise.all(operations);

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      ok: true,
      message: "Categoria cadastrada com sucesso!",
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

function extractFormValues(formData: FormData): CreateCategoryInput {
  return {
    name: String(formData.get("name") || ""),
    description: formData.get("description")?.toString(),
    scope: String(formData.get("scope") || "partners") as CreateCategoryInput["scope"],
  };
}

export async function updateCategory(
  categoryId: string | null,
  existingProductCategoryId: string | null,
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para editar categorias.",
    };
  }

  const parsed = createCategorySchema.safeParse(extractFormValues(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  try {
    const existingCategory = categoryId
      ? await prisma.category.findUnique({
          where: { id: categoryId },
        })
      : null;

    if (categoryId && !existingCategory) {
      return {
        ok: false,
        message: "Categoria nao encontrada.",
      };
    }

    const newSlug = slugify(parsed.data.name);
    const shouldHavePartner = parsed.data.scope !== "products";
    const shouldHaveProduct = parsed.data.scope !== "partners";

    let productCategoryId = existingProductCategoryId;
    if (!productCategoryId && existingCategory?.slug) {
      const productCategory = await prisma.productCategory.findUnique({
        where: { slug: existingCategory.slug },
      });
      productCategoryId = productCategory?.id ?? null;
    }

    // Partner category handling
    if (shouldHavePartner) {
      if (categoryId) {
        await prisma.category.update({
          where: { id: categoryId },
          data: {
            name: parsed.data.name,
            slug: newSlug,
            description: parsed.data.description,
          },
        });
      } else {
        const created = await prisma.category.create({
          data: {
            name: parsed.data.name,
            slug: newSlug,
            description: parsed.data.description,
          },
        });
        categoryId = created.id;
      }
    } else if (categoryId) {
      await prisma.category.delete({
        where: { id: categoryId },
      });
    }

    // Product category handling
    if (shouldHaveProduct) {
      if (productCategoryId) {
        await prisma.productCategory.update({
          where: { id: productCategoryId },
          data: {
            name: parsed.data.name,
            slug: newSlug,
            description: parsed.data.description,
          },
        });
      } else {
        const created = await prisma.productCategory.create({
          data: {
            name: parsed.data.name,
            slug: newSlug,
            description: parsed.data.description,
          },
        });
        productCategoryId = created.id;
      }
    } else if (productCategoryId) {
      await prisma.productCategory.delete({
        where: { id: productCategoryId },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin/overview");
    revalidatePath("/");
    return {
      ok: true,
      message: "Categoria atualizada com sucesso!",
    };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe uma categoria com esse nome."
        : "Erro ao atualizar categoria. Tente novamente.";

    return {
      ok: false,
      message,
    };
  }
}

export async function deleteCategory(formData: FormData) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return;
  }

  const categoryId = formData.get("categoryId")?.toString() || null;
  const productCategoryId = formData.get("productCategoryId")?.toString() || null;

  if (!categoryId && !productCategoryId) {
    return;
  }

  try {
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    if (categoryId) {
      operations.push(
        prisma.category.delete({
          where: { id: categoryId },
        }),
      );
    }

    if (productCategoryId) {
      operations.push(
        prisma.productCategory.delete({
          where: { id: productCategoryId },
        }),
      );
    }

    if (!operations.length) return;

    await prisma.$transaction(operations);
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/overview");
  revalidatePath("/");
}
