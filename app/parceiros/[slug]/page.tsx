import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe2, Tag } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { fetchPartnerBySlug } from "@/lib/data/partners";

type PartnerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PartnerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await fetchPartnerBySlug(slug);
  if (!partner) return { title: "Parceiro não encontrado | CPAD Belém" };

  return {
    title: `${partner.name} | Parceiros CPAD Belém`,
    description: partner.description ?? `Informações de ${partner.name} no diretório de parceiros CPAD Belém.`,
  };
}

export default async function PartnerProfilePage({ params }: PartnerProfilePageProps) {
  const { slug } = await params;
  const partner = await fetchPartnerBySlug(slug);
  if (!partner) notFound();

  const joinedAt = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(partner.createdAt);

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <Link
            href="/parceiros"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--color-wine)] hover:text-[var(--color-wine-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao diretório
          </Link>
        </div>
      </section>

      <article className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-wine)]">
              <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" aria-hidden /> {partner.category}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-gold)]" aria-hidden />
              <span>Parceiro no diretório</span>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-5xl leading-[0.98] tracking-[-0.03em] text-[var(--color-text)] sm:text-6xl">
              {partner.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
              {partner.description ?? "Consulte os canais de atendimento cadastrados para conhecer este parceiro."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/out/partner/${partner.slug}`} prefetch={false}>
                  Visitar canal oficial <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/parceiros">Explorar outras lojas</Link>
              </Button>
            </div>
          </div>

          <aside className="border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-6 shadow-[var(--shadow-card)]">
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
            <dl className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              <InfoLine label="Categoria" value={partner.category} />
              <InfoLine label="No diretório desde" value={joinedAt} />
            </dl>
            <p className="mt-5 flex gap-2 text-xs leading-5 text-[var(--color-text-muted)]">
              <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-wine)]" aria-hidden />
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
      <dt className="font-semibold text-[var(--color-text-muted)]">{label}</dt>
      <dd className="text-right font-bold text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
