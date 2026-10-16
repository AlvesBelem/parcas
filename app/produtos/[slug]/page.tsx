export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPartnerProductBySlug } from "@/lib/data/products";
import { getMarketplaceCta } from "@/lib/marketplaces";
import { getWhatsAppLink } from "@/lib/whatsapp";

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
  const cta = getMarketplaceCta({
    platform: product.platform,
    fallbackLabel: product.ctaLabel,
    fallbackColor: product.ctaColor,
  });
  const whatsappHref = getWhatsAppLink(product.whatsappNumber, "product");
  const description = product.description ?? "Item cadastrado no catálogo de parceiros.";

  return (
    <section className="space-y-10">
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
            Link externo informado pelo parceiro
          </div>
          <ProductDescription description={description} />
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
          <div className="space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full"
              style={{ backgroundColor: cta.color, borderColor: cta.color, color: cta.textColor }}
            >
              <Link href={ctaHref} prefetch={false} className="inline-flex w-full items-center justify-center gap-2">
                {cta.label}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            {whatsappHref ? (
              <Button asChild size="lg" className="w-full bg-[#25D366] text-[#073B23] hover:bg-[#1EBE5D]">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp <MessageCircle className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </section>
  );
}

function ProductDescription({ description }: { description: string }) {
  const blocks = formatDescription(description);

  return (
    <section className="border-y border-[#eaded5] py-5" aria-labelledby="product-description-title">
      <h2 id="product-description-title" className="font-[family-name:var(--font-playfair)] text-2xl text-[#2f1d15]">
        Sobre este produto
      </h2>
      <div className="mt-3 space-y-3 text-left text-[15px] leading-7 text-[#4c3429]">
        {blocks.map((block, index) => {
          if (block.kind === "bullet") {
            return (
              <div key={`${block.text}-${index}`} className="flex gap-3 rounded-xl border border-[#f1e5dc] bg-white/70 px-4 py-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b02b24]" aria-hidden />
                <p>{block.text}</p>
              </div>
            );
          }

          return (
            <p key={`${block.text}-${index}`} className={block.kind === "highlight" ? "font-semibold text-[#2f1d15]" : undefined}>
              {block.text}
            </p>
          );
        })}
      </div>
    </section>
  );
}

function formatDescription(description: string) {
  return description
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+(?=[✓◆•])/gu, "\n")
    .replace(/[ \t]+(?=[🚀💻📱🌐])/gu, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[✓◆•]/u.test(line)) {
        return { kind: "bullet" as const, text: line.replace(/^[✓◆•]\s*/u, "") };
      }

      return { kind: /^[🚀💻📱🌐]/u.test(line) ? "highlight" as const : "paragraph" as const, text: line };
    });
}
