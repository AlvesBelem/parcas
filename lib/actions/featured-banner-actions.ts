"use server";

import { FeaturedBannerTarget } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import type { FormActionState } from "@/lib/actions/form-action-state";
import { isAdminEmail } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function scheduleFeaturedBanner(_: FormActionState, formData: FormData): Promise<FormActionState> {
  if (!(await requireAdmin())) return denied();

  const targetType = parseTargetType(formData.get("targetType"));
  const targetId = String(formData.get("targetId") ?? "").trim();
  const startsAt = parseBannerDate(formData.get("startsAt"));
  const endsAt = parseBannerDate(formData.get("endsAt"), true);

  if (!targetType || !targetId || !startsAt || !endsAt) {
    return { ok: false, message: "Informe o item e as datas de início e término do destaque." };
  }
  if (startsAt > endsAt) {
    return { ok: false, message: "A data de término deve ser igual ou posterior à data de início." };
  }
  if (!(await targetIsActive(targetType, targetId))) {
    return { ok: false, message: "Este item não está ativo ou não foi encontrado. Ative-o antes de adicioná-lo ao banner." };
  }

  const conflictingBanner = await prisma.featuredBanner.findFirst({
    where: {
      active: true,
      targetType,
      targetId,
      startsAt: { lte: endsAt },
      endsAt: { gte: startsAt },
    },
    select: { startsAt: true, endsAt: true },
  });
  if (conflictingBanner) {
    return {
      ok: false,
      message: `Este item já está programado de ${formatDate(conflictingBanner.startsAt)} a ${formatDate(conflictingBanner.endsAt)}. Escolha outro período ou remova a programação existente.`,
    };
  }

  await prisma.featuredBanner.create({
    data: { targetType, targetId, startsAt, endsAt },
  });
  revalidateFeaturedPages();
  return { ok: true, message: "Destaque programado no banner." };
}

export async function removeFeaturedBanner(formData: FormData) {
  if (!(await requireAdmin())) return;
  const bannerId = String(formData.get("bannerId") ?? "").trim();
  if (!bannerId) return;

  await prisma.featuredBanner.updateMany({ where: { id: bannerId, active: true }, data: { active: false } });
  revalidateFeaturedPages();
}

async function targetIsActive(targetType: FeaturedBannerTarget, targetId: string) {
  switch (targetType) {
    case FeaturedBannerTarget.PARTNER:
      return Boolean(await prisma.partner.findFirst({ where: { id: targetId, active: true }, select: { id: true } }));
    case FeaturedBannerTarget.PRODUCT:
      return Boolean(await prisma.partnerProduct.findFirst({ where: { id: targetId, active: true }, select: { id: true } }));
    case FeaturedBannerTarget.SERVICE:
      return Boolean(await prisma.service.findFirst({ where: { id: targetId, active: true }, select: { id: true } }));
  }
}

function parseTargetType(value: FormDataEntryValue | null) {
  const type = String(value ?? "");
  return type === FeaturedBannerTarget.PARTNER || type === FeaturedBannerTarget.PRODUCT || type === FeaturedBannerTarget.SERVICE ? type : null;
}

function parseBannerDate(value: FormDataEntryValue | null, endOfDay = false) {
  const date = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}-03:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session && isAdminEmail(session.user?.email));
}

function denied(): FormActionState {
  return { ok: false, message: "Você precisa estar autenticado como admin para programar o banner." };
}

function revalidateFeaturedPages() {
  revalidatePath("/");
  revalidatePath("/parceiros");
  revalidatePath("/admin/partners");
  revalidatePath("/admin/products");
  revalidatePath("/admin/services");
  revalidatePath("/admin/overview");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}
