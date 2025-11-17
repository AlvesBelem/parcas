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
    const product = await prisma.partnerProduct.findUnique({
      where: { slug },
      select: { id: true, url: true },
    });

    if (!product?.url || !product.id) {
      throw new Error("Product not found");
    }

    if (!isPrefetch && isNavigation) {
      const today = startOfDay(new Date());
      await prisma.$transaction([
        prisma.partnerProduct.update({
          where: { id: product.id },
          data: { clickCount: { increment: 1 } },
        }),
        prisma.productClickStat.upsert({
          where: {
            productId_date: {
              productId: product.id,
              date: today,
            },
          },
          update: { count: { increment: 1 } },
          create: {
            productId: product.id,
            date: today,
            count: 1,
          },
        }),
      ]);
    }

    return NextResponse.redirect(product.url, { status: 302 });
  } catch (error) {
    console.error("Erro ao registrar clique de produto", { slug, error });
  }

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "https://nosite.com"));
}
