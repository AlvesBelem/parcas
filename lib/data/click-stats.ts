import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/start-of-day";

export type ClickStatEntry = {
  id: string;
  label: string;
  badge?: string | null;
  clicks: number;
};

export type ClickSeriesPoint = {
  date: string;
  clicks: number;
};

function sinceDays(days: number) {
  const now = new Date();
  const ms = (days - 1) * 24 * 60 * 60 * 1000;
  return startOfDay(new Date(now.getTime() - ms));
}

export async function fetchTopPartnerClicks(
  days: number,
  take = 5,
): Promise<ClickStatEntry[]> {
  const since = sinceDays(days);
  const grouped = await prisma.partnerClickStat.groupBy({
    by: ["partnerId"],
    where: { date: { gte: since } },
    _sum: { count: true },
    orderBy: { _sum: { count: "desc" } },
    take,
  });

  const ids = grouped.map((g) => g.partnerId);
  if (!ids.length) return [];

  const partners = await prisma.partner.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, category: true },
  });
  const map = new Map(partners.map((p) => [p.id, p]));

  return grouped
    .map((g) => ({
      id: g.partnerId,
      label: map.get(g.partnerId)?.name ?? "Parceiro",
      badge: map.get(g.partnerId)?.category ?? "",
      clicks: g._sum.count ?? 0,
    }))
    .filter((item) => item.clicks > 0);
}

export async function fetchTopProductClicks(
  days: number,
  take = 5,
): Promise<ClickStatEntry[]> {
  const since = sinceDays(days);
  const grouped = await prisma.productClickStat.groupBy({
    by: ["productId"],
    where: { date: { gte: since } },
    _sum: { count: true },
    orderBy: { _sum: { count: "desc" } },
    take,
  });

  const ids = grouped.map((g) => g.productId);
  if (!ids.length) return [];

  const products = await prisma.partnerProduct.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      platform: true,
      category: { select: { name: true } },
    },
  });
  const map = new Map(products.map((p) => [p.id, p]));

  return grouped
    .map((g) => {
      const product = map.get(g.productId);
      return {
        id: g.productId,
        label: product?.name ?? "Produto",
        badge: product?.category?.name ?? product?.platform ?? "",
        clicks: g._sum.count ?? 0,
      };
    })
    .filter((item) => item.clicks > 0);
}

export async function fetchPartnerClickSeries(days: number): Promise<ClickSeriesPoint[]> {
  const since = sinceDays(days);
  const rows = await prisma.partnerClickStat.groupBy({
    by: ["date"],
    where: { date: { gte: since } },
    _sum: { count: true },
    orderBy: { date: "asc" },
  });
  return fillSeries(days, rows);
}

export async function fetchProductClickSeries(days: number): Promise<ClickSeriesPoint[]> {
  const since = sinceDays(days);
  const rows = await prisma.productClickStat.groupBy({
    by: ["date"],
    where: { date: { gte: since } },
    _sum: { count: true },
    orderBy: { date: "asc" },
  });
  return fillSeries(days, rows);
}

function fillSeries(
  days: number,
  rows: { date: Date; _sum: { count: number | null } }[],
): ClickSeriesPoint[] {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    const key = startOfDay(row.date).toISOString();
    map.set(key, (map.get(key) ?? 0) + (row._sum.count ?? 0));
  });

  const result: ClickSeriesPoint[] = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const targetDay = startOfDay(new Date(Date.now() - offset * 24 * 60 * 60 * 1000));
    const key = targetDay.toISOString();
    result.push({
      date: key,
      clicks: map.get(key) ?? 0,
    });
  }
  return result;
}
