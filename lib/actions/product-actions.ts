"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  createProductSchema,
  type CreateProductInput,
  updateProductSchema,
} from "@/lib/validations/product";
import type { FormActionState } from "@/lib/actions/form-action-state";

export async function createProduct(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para cadastrar produtos.",
    };
  }

  const parsed = createProductSchema.safeParse(extractProductFormValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.productCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message: "Categoria de produto nao encontrada. Recarregue e tente novamente.",
    };
  }

  try {
    await prisma.partnerProduct.create({
      data: {
        ...parsed.data,
        categoryId: category.id,
        imageUrls: parsed.data.imageUrls,
        price: parsed.data.price ? new Prisma.Decimal(parsed.data.price) : undefined,
        slug: slugify(parsed.data.name),
      },
    });
    revalidateProducts();
    return { ok: true, message: "Produto cadastrado com sucesso!" };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe um produto com esse nome."
        : "Erro ao salvar produto. Tente novamente.";
    return { ok: false, message };
  }
}

export async function updateProduct(
  productId: string,
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para editar produtos.",
    };
  }

  const parsed = updateProductSchema.safeParse({
    productId,
    ...extractProductFormValues(formData),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.productCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message: "Categoria de produto nao encontrada. Recarregue e tente novamente.",
    };
  }

  try {
    await prisma.partnerProduct.update({
      where: { id: parsed.data.productId },
      data: {
        name: parsed.data.name,
        platform: parsed.data.platform,
        url: parsed.data.url,
        categoryId: category.id,
        imageUrls: parsed.data.imageUrls,
        description: parsed.data.description,
        price: parsed.data.price ? new Prisma.Decimal(parsed.data.price) : undefined,
        slug: slugify(parsed.data.name),
      },
    });
    revalidateProducts();
    return { ok: true, message: "Produto atualizado com sucesso!" };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe um produto com esse nome."
        : "Erro ao atualizar produto. Tente novamente.";
    return { ok: false, message };
  }
}

export async function toggleProductStatus(formData: FormData) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return;
  }

  const productId = String(formData.get("productId") || "");
  const nextStatus = String(formData.get("nextStatus") || "") === "true";

  if (!productId) return;

  await prisma.partnerProduct.update({
    where: { id: productId },
    data: { active: nextStatus },
  });

  revalidateProducts();
}

function extractProductFormValues(formData: FormData): CreateProductInput {
  const imageUrls = formData
    .getAll("imageUrls")
    .map((value) => value.toString().trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    platform: String(formData.get("platform") || ""),
    url: String(formData.get("url") || ""),
    imageUrls,
    price: formData.get("price")?.toString() ?? undefined,
    description: formData.get("description")?.toString(),
  };
}

function revalidateProducts() {
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/overview");
}
