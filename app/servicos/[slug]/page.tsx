import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle, Wrench } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormattedDescription } from "@/components/catalog/formatted-description";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchServiceBySlug } from "@/lib/data/services";
import { absoluteUrl, metaDescription, siteConfig, urlOrAbsoluteUrl } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/whatsapp";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) return { title: "Serviço não encontrado | Parceiros CPAD Belém" };

  const canonicalPath = `/servicos/${service.slug}`;
  const description = metaDescription(service.description, `${service.name}: serviço disponível no catálogo de parceiros CPAD Belém.`);
  const image = urlOrAbsoluteUrl(service.imageUrl, siteConfig.socialImagePath);

  return {
    title: { absolute: `${service.name} | Serviços parceiros CPAD Belém` },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: `${service.name} | Serviços parceiros CPAD Belém`,
      description,
      images: [{ url: image, alt: service.name }],
    },
    twitter: { card: "summary_large_image", title: service.name, description, images: [image] },
  };
}

export default async function ServiceDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) notFound();
  const whatsappHref = getWhatsAppLink(service.whatsappNumber, "service");
  const canonicalPath = `/servicos/${service.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const description = metaDescription(service.description, `${service.name}: serviço disponível no catálogo de parceiros CPAD Belém.`);
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${canonicalUrl}#service`,
              name: service.name,
              description,
              url: canonicalUrl,
              image: urlOrAbsoluteUrl(service.imageUrl, siteConfig.socialImagePath),
              serviceType: service.category.name,
              sameAs: service.url,
            },
            {
              "@type": "WebPage",
              "@id": canonicalUrl,
              url: canonicalUrl,
              name: `${service.name} | Serviços parceiros CPAD Belém`,
              description,
              inLanguage: siteConfig.language,
              isPartOf: { "@id": `${absoluteUrl("/")}#website` },
              mainEntity: { "@id": `${canonicalUrl}#service` },
            },
          ],
        }}
      />
      <Link href="/servicos" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-(--color-wine) hover:text-(--color-wine-dark)"><ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para serviços</Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-(--color-wine)"><Wrench className="h-4 w-4" aria-hidden /> {service.category.name}</p>
          <h1 className="mt-4 font-(family-name:--font-playfair) text-5xl leading-tight text-(--color-text) sm:text-6xl">{service.name}</h1>
          <FormattedDescription title="Sobre o serviço" description={service.description ?? "Consulte o canal de atendimento para conhecer este serviço."} className="mt-6" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/out/service/${service.slug}`} prefetch={false}>{service.ctaLabel || "Conhecer serviço"}<ExternalLink className="h-4 w-4" aria-hidden /></Link></Button>
            {whatsappHref ? <Button asChild size="lg" className="bg-[#25D366] text-[#073B23] hover:bg-[#1EBE5D]"><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Falar no WhatsApp <MessageCircle className="h-4 w-4" aria-hidden /></a></Button> : null}
          </div>
        </div>
        <aside className="border border-(--color-border) bg-(--color-surface-warm) p-5 shadow-(--shadow-card)"><div className="relative h-52 overflow-hidden bg-white"><Image src={service.imageUrl || "/logo_cpad_belem.svg"} alt={service.imageUrl ? service.name : "CPAD Belém"} fill className="object-contain p-5" sizes="360px" unoptimized /></div><dl className="mt-5 border-y border-(--color-border) py-3 text-sm"><div className="flex justify-between gap-4 py-2"><dt className="text-(--color-text-muted)">Categoria</dt><dd className="font-bold text-(--color-text)">{service.category.name}</dd></div><div className="flex justify-between gap-4 py-2"><dt className="text-(--color-text-muted)">Publicado em</dt><dd className="font-bold text-(--color-text)">{new Intl.DateTimeFormat("pt-BR").format(service.createdAt)}</dd></div></dl></aside>
      </div>
    </section>
  );
}
