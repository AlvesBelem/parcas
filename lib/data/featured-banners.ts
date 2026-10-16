import { FeaturedBannerTarget } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type FeaturedBannerSchedule = {
  id: string;
  targetType: FeaturedBannerTarget;
  targetId: string;
  startsAt: Date;
  endsAt: Date;
  active: boolean;
};

export type FeaturedCatalogBanner = {
  id: string;
  targetType: FeaturedBannerTarget;
  targetId: string;
  title: string;
  category: string;
  description: string | null;
  imageUrl: string;
  href: string;
  ctaLabel: string;
};

export async function fetchActiveFeaturedBanners(): Promise<FeaturedCatalogBanner[]> {
  const now = new Date();
  const schedules = await prisma.featuredBanner.findMany({
    where: {
      active: true,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }],
    select: { id: true, targetType: true, targetId: true },
  });

  const banners = await Promise.all(schedules.map((schedule) => resolveBannerContent(schedule)));
  return banners.filter((banner): banner is FeaturedCatalogBanner => Boolean(banner));
}

export async function fetchFeaturedBannerSchedules(): Promise<FeaturedBannerSchedule[]> {
  return prisma.featuredBanner.findMany({
    where: {
      active: true,
      endsAt: { gte: new Date() },
    },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      startsAt: true,
      endsAt: true,
      active: true,
    },
    orderBy: { startsAt: "asc" },
  });
}

async function resolveBannerContent({
  id,
  targetType,
  targetId,
}: {
  id: string;
  targetType: FeaturedBannerTarget;
  targetId: string;
}): Promise<FeaturedCatalogBanner | null> {
  switch (targetType) {
    case FeaturedBannerTarget.PARTNER: {
      const partner = await prisma.partner.findFirst({ where: { id: targetId, active: true } });
      if (!partner) return null;
      return {
        id,
        targetType,
        targetId,
        title: partner.name,
        category: partner.category,
        description: partner.description,
        imageUrl: partner.logoUrl,
        href: `/parceiros/${partner.slug}`,
        ctaLabel: "Conhecer loja",
      };
    }
    case FeaturedBannerTarget.PRODUCT: {
      const product = await prisma.partnerProduct.findFirst({
        where: { id: targetId, active: true },
        include: { category: { select: { name: true } } },
      });
      if (!product) return null;
      return {
        id,
        targetType,
        targetId,
        title: product.name,
        category: product.category?.name ?? "Produto afiliado",
        description: product.description,
        imageUrl: product.imageUrls[0] ?? "/logo_cpad_belem.svg",
        href: `/produtos/${product.slug}`,
        ctaLabel: "Ver produto",
      };
    }
    case FeaturedBannerTarget.SERVICE: {
      const service = await prisma.service.findFirst({
        where: { id: targetId, active: true },
        include: { category: { select: { name: true } } },
      });
      if (!service) return null;
      return {
        id,
        targetType,
        targetId,
        title: service.name,
        category: service.category.name,
        description: service.description,
        imageUrl: service.imageUrl ?? "/logo_cpad_belem.svg",
        href: `/servicos/${service.slug}`,
        ctaLabel: "Conhecer serviço",
      };
    }
  }
}

export function getFeaturedTargetIds(
  banners: readonly FeaturedCatalogBanner[],
  targetType: FeaturedBannerTarget,
) {
  return new Set(
    banners
      .filter((banner) => banner.targetType === targetType)
      .map((banner) => banner.targetId),
  );
}

export function prioritizeFeatured<T extends { id: string; createdAt: Date }>(
  entries: readonly T[],
  featuredTargetIds: ReadonlySet<string>,
) {
  return [...entries].sort((left, right) => {
    const featuredDifference = Number(featuredTargetIds.has(right.id)) - Number(featuredTargetIds.has(left.id));
    return featuredDifference || right.createdAt.getTime() - left.createdAt.getTime();
  });
}
