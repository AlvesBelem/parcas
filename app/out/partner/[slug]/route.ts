export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/start-of-day";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const isPrefetch =
    req.headers.get("purpose") === "prefetch" ||
    req.headers.get("x-middleware-prefetch") === "1" ||
    req.headers.get("next-router-prefetch") === "1";
  const dest = req.headers.get("sec-fetch-dest") || "";
  const isNavigation = dest === "" || dest === "document";

  try {
    const partner = await prisma.partner.findUnique({
      where: { slug },
      select: { id: true, url: true },
    });

    if (!partner?.url || !partner.id) {
      throw new Error("Partner not found");
    }

    if (!isPrefetch && isNavigation) {
      const today = startOfDay(new Date());
      await prisma.$transaction([
        prisma.partner.update({
          where: { id: partner.id },
          data: { clickCount: { increment: 1 } },
        }),
        prisma.partnerClickStat.upsert({
          where: {
            partnerId_date: {
              partnerId: partner.id,
              date: today,
            },
          },
          update: { count: { increment: 1 } },
          create: {
            partnerId: partner.id,
            date: today,
            count: 1,
          },
        }),
      ]);
    }

    return NextResponse.redirect(partner.url, { status: 302 });
  } catch (error) {
    console.error("Erro ao registrar clique de parceiro", { slug, error });
  }

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "https://nosite.com"));
}
