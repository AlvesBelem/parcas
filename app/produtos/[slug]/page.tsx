export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPartnerProductBySlug } from "@/lib/data/products";

type PageParams = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const product = await fetchPartnerProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
  const otherImages = product.imageUrls.slice(1, 6);
  const ctaHref = `/out/product/${product.slug}`;
  const ctaLabel = product.ctaLabel?.trim() || "Ir para o link oficial";
  const ctaColor = product.ctaColor?.trim() || "#b02b24";

  return (
    <main className="space-y-10">
      <div className="flex flex-col gap-3">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 text-sm text-[#b02b24] hover:text-[#8f1f19]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>
        <h1 className="text-4xl font-semibold text-[#2f1d15]" style={{ fontFamily: "var(--font-playfair)" }}>
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#7a5a4b]">
          <Badge>{product.platform}</Badge>
          <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
          <Badge variant="outline">{product.clickCount} cliques</Badge>
          {!product.active && (
            <Badge variant="outline" className="text-[#b02b24]">
              Inativo
            </Badge>
          )}
        </div>
      </div>

      <section className="space-y-6 rounded-3xl border border-[#eaded5] bg-white p-6 shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#f3e7de] bg-[#fff8f3]">
            <Image
              src={coverImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
          {otherImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {otherImages.map((image, index) => (
                <div
                  key={image + index.toString()}
                  className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#eaded5] bg-[#fff8f3]"
                >
                  <Image
                    src={image}
                    alt={`${product.name} imagem ${index + 2}`}
                    fill
                    className="object-contain"
                    sizes="96px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-[#f1e5dc] bg-[#fff8f3] p-5 text-[#3f2b22]">
          <div className="flex items-center gap-2 text-sm text-[#b02b24]">
            <ShieldCheck className="h-4 w-4" />
            Link verificado pela CPAD Belém
          </div>
          <p className="text-base leading-relaxed text-[#4c3429]">
            {product.description ?? "Oferta oficial cadastrada pelos administradores."}
          </p>
          <div className="space-y-2 text-sm text-[#7a5a4b]">
            <p>
              <span className="font-semibold text-[#2f1d15]">Plataforma: </span>
              {product.platform}
            </p>
            <p>
              <span className="font-semibold text-[#2f1d15]">Categoria: </span>
              {product.category?.name ?? "Sem categoria"}
            </p>
            <p>
              <span className="font-semibold text-[#2f1d15]">Publicado em: </span>
              {new Intl.DateTimeFormat("pt-BR").format(new Date(product.createdAt))}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="w-full text-white"
            style={{ backgroundColor: ctaColor, borderColor: ctaColor }}
          >
            <Link href={ctaHref} prefetch={false} className="inline-flex w-full items-center justify-center gap-2">
              {ctaLabel}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
