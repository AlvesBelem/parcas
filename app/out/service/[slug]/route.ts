export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/start-of-day";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isPrefetch = req.headers.get("purpose") === "prefetch" || req.headers.get("x-middleware-prefetch") === "1" || req.headers.get("next-router-prefetch") === "1";
  const destination = req.headers.get("sec-fetch-dest") || "";
  const isNavigation = !destination || destination === "document";

  try {
    const service = await prisma.service.findUnique({ where: { slug }, select: { id: true, url: true } });
    if (!service) throw new Error("Service not found");
    if (!isPrefetch && isNavigation) {
      const date = startOfDay(new Date());
      await prisma.$transaction([
        prisma.service.update({ where: { id: service.id }, data: { clickCount: { increment: 1 } } }),
        prisma.serviceClickStat.upsert({ where: { serviceId_date: { serviceId: service.id, date } }, update: { count: { increment: 1 } }, create: { serviceId: service.id, date, count: 1 } }),
      ]);
    }
    return NextResponse.redirect(service.url, { status: 302 });
  } catch (error) {
    console.error("Erro ao registrar clique de serviço", { slug, error });
    return NextResponse.redirect(new URL("/servicos", process.env.NEXT_PUBLIC_SITE_URL ?? "https://nosite.com"));
  }
}
