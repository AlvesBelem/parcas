"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/utils";
import {
  createProductSchema,
  type CreateProductInput,
  updateProductSchema,
} from "@/lib/validations/product";
import type { FormActionState } from "@/lib/actions/form-action-state";

export async function createProduct(
  _: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message:
        "Voce precisa estar autenticado como admin para cadastrar produtos.",
    };
  }

  const parsed = createProductSchema.safeParse(
    extractProductFormValues(formData)
  );

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.productCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message:
        "Categoria de produto nao encontrada. Recarregue e tente novamente.",
    };
  }

  try {
    // Buscar slugs existentes para garantir unicidade
    const existingSlugs = await prisma.partnerProduct
      .findMany({
        select: { slug: true },
      })
      .then((products) => products.map((p) => p.slug));

    const uniqueSlug = await generateUniqueSlug(
      parsed.data.name,
      existingSlugs
    );

    const data: Prisma.PartnerProductUncheckedCreateInput = {
      name: parsed.data.name,
      platform: parsed.data.platform,
      url: parsed.data.url,
      ctaLabel: parsed.data.ctaLabel,
      ctaColor: parsed.data.ctaColor,
      imageUrls: parsed.data.imageUrls,
      description: parsed.data.description,
      slug: uniqueSlug,
      categoryId: category.id,
      active: true,
    };

    await prisma.partnerProduct.create({ data });
    revalidateProducts();
    return { ok: true, message: "Produto cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    const message = deriveProductErrorMessage(error);
    return { ok: false, message };
  }
}

export async function updateProduct(
  productId: string,
  _: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message:
        "Voce precisa estar autenticado como admin para editar produtos.",
    };
  }

  const parsed = updateProductSchema.safeParse({
    productId,
    ...extractProductFormValues(formData),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.productCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message:
        "Categoria de produto nao encontrada. Recarregue e tente novamente.",
    };
  }

  try {
    // Buscar slugs existentes, excluindo o produto atual
    const existingSlugs = await prisma.partnerProduct
      .findMany({
        where: { id: { not: parsed.data.productId } },
        select: { slug: true },
      })
      .then((products) => products.map((p) => p.slug));

    const uniqueSlug = await generateUniqueSlug(
      parsed.data.name,
      existingSlugs
    );

    const data: Prisma.PartnerProductUncheckedUpdateInput = {
      name: parsed.data.name,
      platform: parsed.data.platform,
      url: parsed.data.url,
      ctaLabel: parsed.data.ctaLabel,
      ctaColor: parsed.data.ctaColor,
      imageUrls: parsed.data.imageUrls,
      description: parsed.data.description,
      slug: uniqueSlug,
      categoryId: category.id,
    };

    await prisma.partnerProduct.update({
      where: { id: parsed.data.productId },
      data,
    });
    revalidateProducts();
    return { ok: true, message: "Produto atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    const message = deriveProductErrorMessage(error);
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

export async function deleteProduct(formData: FormData) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return;
  }

  const productId = String(formData.get("productId") || "");

  if (!productId) return;

  await prisma.$transaction([
    prisma.productClickStat.deleteMany({ where: { productId } }),
    prisma.partnerProduct.delete({ where: { id: productId } }),
  ]);

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
    ctaLabel: String(formData.get("ctaLabel") || "Ir para link oficial").trim(),
    ctaColor: String(formData.get("ctaColor") || "#b02b24").trim(),
    imageUrls,
    description: formData.get("description")?.toString(),
  };
}

function revalidateProducts() {
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/overview");
}

function deriveProductErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Ja existe um produto com esse nome ou slug.";
    }
    if (error.code === "P2003") {
      return "Categoria selecionada nao existe mais. Recarregue a pagina.";
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Dados do produto invalidos. Verifique preco, URLs e categoria.";
  }
  const message = (error as Error)?.message;
  if (message) {
    return `Erro ao salvar produto: ${message}`;
  }
  return "Erro ao salvar produto. Tente novamente.";
}
