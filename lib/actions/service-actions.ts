"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import type { FormActionState } from "@/lib/actions/form-action-state";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/utils";
import { serviceCategorySchema, serviceSchema, type ServiceInput } from "@/lib/validations/service";

export async function createService(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const allowed = await requireAdmin();
  if (!allowed) return denied();
  const parsed = serviceSchema.safeParse(readServiceForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Não foi possível validar o serviço." };
  const category = await prisma.serviceCategory.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { ok: false, message: "A categoria de serviço não foi encontrada." };

  try {
    const slugs = await prisma.service.findMany({ select: { slug: true } }).then((items) => items.map((item) => item.slug));
    await prisma.service.create({ data: { ...parsed.data, slug: await generateUniqueSlug(parsed.data.name, slugs), ctaColor: "#750B2A" } });
    revalidateServices();
    return { ok: true, message: "Serviço cadastrado com sucesso." };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function updateService(serviceId: string, _: FormActionState, formData: FormData): Promise<FormActionState> {
  const allowed = await requireAdmin();
  if (!allowed) return denied();
  const parsed = serviceSchema.safeParse(readServiceForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Não foi possível validar o serviço." };
  const category = await prisma.serviceCategory.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { ok: false, message: "A categoria de serviço não foi encontrada." };

  try {
    const slugs = await prisma.service.findMany({ where: { id: { not: serviceId } }, select: { slug: true } }).then((items) => items.map((item) => item.slug));
    await prisma.service.update({ where: { id: serviceId }, data: { ...parsed.data, slug: await generateUniqueSlug(parsed.data.name, slugs) } });
    revalidateServices();
    return { ok: true, message: "Serviço atualizado com sucesso." };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function createServiceCategory(_: FormActionState, formData: FormData): Promise<FormActionState> {
  const allowed = await requireAdmin();
  if (!allowed) return denied();
  const parsed = serviceCategorySchema.safeParse({ name: String(formData.get("name") ?? ""), description: formData.get("description")?.toString() });
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Não foi possível validar a categoria." };
  try {
    await prisma.serviceCategory.create({ data: { ...parsed.data, slug: slugify(parsed.data.name) } });
    revalidateServices();
    return { ok: true, message: "Categoria de serviço cadastrada." };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function toggleServiceStatus(formData: FormData) {
  if (!(await requireAdmin())) return;
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!serviceId) return;
  await prisma.service.update({ where: { id: serviceId }, data: { active: String(formData.get("nextStatus")) === "true" } });
  revalidateServices();
}

export async function deleteService(formData: FormData) {
  if (!(await requireAdmin())) return;
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!serviceId) return;
  await prisma.$transaction([prisma.serviceClickStat.deleteMany({ where: { serviceId } }), prisma.service.delete({ where: { id: serviceId } })]);
  revalidateServices();
}

function readServiceForm(formData: FormData): ServiceInput {
  return { name: String(formData.get("name") ?? ""), categoryId: String(formData.get("categoryId") ?? ""), url: String(formData.get("url") ?? ""), imageUrl: String(formData.get("imageUrl") ?? ""), ctaLabel: String(formData.get("ctaLabel") ?? ""), description: String(formData.get("description") ?? "") };
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session && isAdminEmail(session.user?.email));
}

function denied(): FormActionState {
  return { ok: false, message: "Você precisa estar autenticado como admin para realizar esta ação." };
}

function revalidateServices() {
  revalidatePath("/");
  revalidatePath("/servicos");
  revalidatePath("/admin/services");
  revalidatePath("/admin/overview");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "Já existe um cadastro com esse nome.";
  return "Não foi possível salvar. Revise os dados e tente novamente.";
}
