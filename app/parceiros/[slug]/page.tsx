import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe2, MessageCircle, Tag } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormattedDescription } from "@/components/catalog/formatted-description";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchPartnerBySlug } from "@/lib/data/partners";
import { absoluteUrl, metaDescription, siteConfig, urlOrAbsoluteUrl } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/whatsapp";

type PartnerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PartnerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await fetchPartnerBySlug(slug);
  if (!partner) return { title: "Parceiro não encontrado | CPAD Belém" };

  const canonicalPath = `/parceiros/${partner.slug}`;
  const description = metaDescription(partner.description, `Informações de ${partner.name} no diretório de parceiros CPAD Belém.`);
  const image = urlOrAbsoluteUrl(partner.logoUrl, siteConfig.socialImagePath);

  return {
    title: { absolute: `${partner.name} | Parceiros CPAD Belém` },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: `${partner.name} | Parceiros CPAD Belém`,
      description,
      images: [{ url: image, alt: `Marca ${partner.name}` }],
    },
    twitter: { card: "summary_large_image", title: partner.name, description, images: [image] },
  };
}

export default async function PartnerProfilePage({ params }: PartnerProfilePageProps) {
  const { slug } = await params;
  const partner = await fetchPartnerBySlug(slug);
  if (!partner) notFound();

  const joinedAt = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(partner.createdAt);
  const whatsappHref = getWhatsAppLink(partner.whatsappNumber, "partner");
  const canonicalPath = `/parceiros/${partner.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const description = metaDescription(partner.description, `Informações de ${partner.name} no diretório de parceiros CPAD Belém.`);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${canonicalUrl}#partner`,
              name: partner.name,
              url: canonicalUrl,
              logo: urlOrAbsoluteUrl(partner.logoUrl, siteConfig.logoPath),
              description,
              sameAs: partner.url ? [partner.url] : undefined,
            },
            {
              "@type": "WebPage",
              "@id": canonicalUrl,
              url: canonicalUrl,
              name: `${partner.name} | Parceiros CPAD Belém`,
              description,
              inLanguage: siteConfig.language,
              isPartOf: { "@id": `${absoluteUrl("/")}#website` },
              mainEntity: { "@id": `${canonicalUrl}#partner` },
            },
          ],
        }}
      />
      <section className="border-b border-(--color-border) bg-(--color-surface) px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-280">
          <Link
            href="/parceiros"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-(--color-wine) hover:text-(--color-wine-dark) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-focus)"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao diretório
          </Link>
        </div>
      </section>

      <article className="mx-auto max-w-280 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-(--color-wine)">
              <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" aria-hidden /> {partner.category}</span>
              <span className="h-1 w-1 rounded-full bg-(--color-gold)" aria-hidden />
              <span>Parceiro no diretório</span>
            </div>
            <h1 className="mt-5 font-(family-name:--font-playfair) text-5xl leading-[0.98] tracking-[-0.03em] text-(--color-text) sm:text-6xl">
              {partner.name}
            </h1>
            <FormattedDescription
              title="Sobre a loja"
              description={partner.description ?? "Consulte os canais de atendimento cadastrados para conhecer este parceiro."}
              className="mt-6 max-w-2xl"
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/out/partner/${partner.slug}`} prefetch={false} target="_blank" rel="noopener noreferrer">
                  Visitar canal oficial <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              {whatsappHref ? (
                <Button asChild size="lg" className="bg-[#25D366] text-[#073B23] hover:bg-[#1EBE5D]">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp <MessageCircle className="h-4 w-4" aria-hidden />
                  </a>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="secondary">
                <Link href="/parceiros">Explorar outras lojas</Link>
              </Button>
            </div>
          </div>

          <aside className="border border-(--color-border) bg-(--color-surface-warm) p-6 shadow-(--shadow-card)">
            <div className="flex h-32 items-center justify-center border border-white bg-white p-5 shadow-sm">
              <Image
                src={partner.logoUrl}
                alt={`Marca ${partner.name}`}
                width={200}
                height={128}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
            <dl className="mt-6 divide-y divide-(--color-border) border-y border-(--color-border)">
              <InfoLine label="Categoria" value={partner.category} />
              <InfoLine label="No diretório desde" value={joinedAt} />
            </dl>
            <p className="mt-5 flex gap-2 text-xs leading-5 text-(--color-text-muted)">
              <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-(--color-wine)" aria-hidden />
              Ao visitar, você será direcionado ao canal informado pelo parceiro.
            </p>
          </aside>
        </div>
      </article>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 py-4 text-sm">
      <dt className="font-semibold text-(--color-text-muted)">{label}</dt>
      <dd className="text-right font-bold text-(--color-text)">{value}</dd>
    </div>
  );
}
