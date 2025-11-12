"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  createPartnerSchema,
  type CreatePartnerInput,
  updatePartnerSchema,
} from "@/lib/validations/partner";
import type { FormActionState } from "@/lib/actions/form-action-state";

export async function createPartner(
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para cadastrar parceiros.",
    };
  }

  const parsed = createPartnerSchema.safeParse(extractFormValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message: "Categoria nao encontrada. Recarregue a pagina e tente novamente.",
    };
  }

  try {
    await prisma.partner.create({
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        logoUrl: parsed.data.logoUrl,
        description: parsed.data.description,
        category: category.name,
        slug: slugify(parsed.data.name),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      ok: true,
      message: "Parceiro cadastrado com sucesso!",
    };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe um parceiro com esse nome."
        : "Erro ao salvar parceiro. Tente novamente.";

    return {
      ok: false,
      message,
    };
  }
}

function extractFormValues(formData: FormData): CreatePartnerInput {
  return {
    name: String(formData.get("name") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    url: String(formData.get("url") || ""),
    logoUrl: String(formData.get("logoUrl") || ""),
    description: formData.get("description")?.toString(),
  };
}

export async function updatePartner(
  partnerId: string,
  _: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      ok: false,
      message: "Voce precisa estar autenticado como admin para editar parceiros.",
    };
  }

  const parsed = updatePartnerSchema.safeParse({
    partnerId,
    ...extractFormValues(formData),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Nao foi possivel validar os dados.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return {
      ok: false,
      message: "Categoria nao encontrada. Recarregue a pagina e tente novamente.",
    };
  }

  try {
    await prisma.partner.update({
      where: { id: parsed.data.partnerId },
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        logoUrl: parsed.data.logoUrl,
        description: parsed.data.description,
        category: category.name,
        slug: slugify(parsed.data.name),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/partners");
    revalidatePath("/admin/overview");

    return {
      ok: true,
      message: "Parceiro atualizado com sucesso!",
    };
  } catch (error) {
    const message =
      (error as Error)?.message.includes("Unique constraint failed")
        ? "Ja existe um parceiro com esse nome."
        : "Erro ao atualizar parceiro. Tente novamente.";

    return {
      ok: false,
      message,
    };
  }
}

export async function togglePartnerStatus(formData: FormData) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return;
  }

  const partnerId = String(formData.get("partnerId") || "");
  const nextStatus = String(formData.get("nextStatus") || "") === "true";

  if (!partnerId) {
    return;
  }

  try {
    await prisma.partner.update({
      where: { id: partnerId },
      data: { active: nextStatus },
    });

    revalidatePath("/");
    revalidatePath("/admin/partners");
    revalidatePath("/admin/overview");
  } catch (error) {
    console.error("Erro ao alterar status do parceiro:", error);
  }
}
