import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle, Wrench } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormattedDescription } from "@/components/catalog/formatted-description";
import { fetchServiceBySlug } from "@/lib/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) notFound();
  const whatsappHref = getWhatsAppLink(service.whatsappNumber, "service");
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <Link href="/servicos" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--color-wine)] hover:text-[var(--color-wine-dark)]"><ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para serviços</Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]"><Wrench className="h-4 w-4" aria-hidden /> {service.category.name}</p>
          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-5xl leading-tight text-[var(--color-text)] sm:text-6xl">{service.name}</h1>
          <FormattedDescription title="Sobre o serviço" description={service.description ?? "Consulte o canal de atendimento para conhecer este serviço."} className="mt-6" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/out/service/${service.slug}`} prefetch={false}>{service.ctaLabel || "Conhecer serviço"}<ExternalLink className="h-4 w-4" aria-hidden /></Link></Button>
            {whatsappHref ? <Button asChild size="lg" className="bg-[#25D366] text-[#073B23] hover:bg-[#1EBE5D]"><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Falar no WhatsApp <MessageCircle className="h-4 w-4" aria-hidden /></a></Button> : null}
          </div>
        </div>
        <aside className="border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-5 shadow-[var(--shadow-card)]"><div className="relative h-52 overflow-hidden bg-white"><Image src={service.imageUrl || "/logo_cpad_belem.svg"} alt={service.imageUrl ? service.name : "CPAD Belém"} fill className="object-contain p-5" sizes="360px" unoptimized /></div><dl className="mt-5 border-y border-[var(--color-border)] py-3 text-sm"><div className="flex justify-between gap-4 py-2"><dt className="text-[var(--color-text-muted)]">Categoria</dt><dd className="font-bold text-[var(--color-text)]">{service.category.name}</dd></div><div className="flex justify-between gap-4 py-2"><dt className="text-[var(--color-text-muted)]">Publicado em</dt><dd className="font-bold text-[var(--color-text)]">{new Intl.DateTimeFormat("pt-BR").format(service.createdAt)}</dd></div></dl></aside>
      </div>
    </section>
  );
}
