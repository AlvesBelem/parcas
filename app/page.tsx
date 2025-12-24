import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NoScroll } from "@/components/layout/no-scroll";

export default function Home() {
  return (
    <>
      <NoScroll />
      <div className="flex h-full w-full items-center justify-center overflow-hidden px-2 sm:px-0">
        <section className="w-full max-w-6xl overflow-hidden text-[#2d1c16]">
          <div className="grid gap-4 p-4 sm:grid-cols-[1.2fr_1fr] sm:p-4 lg:p-5">
            <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#b02a20]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#b02a20]">
              Rede oficial
              <ShieldCheck className="h-4 w-4" />
              CPAD Belém
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Rede CPAD Belém: parceiros confiáveis e produtos oficiais em um só lugar
            </h1>
            <p className="max-w-2xl text-base text-neutral-700">
              Escolhemos a dedo lojas, serviços e itens para recomendar aos nossos clientes. Acesse
              a lista completa de parceiros ou veja os produtos oficiais disponíveis.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-[#8c1f18]/25">
                <Link href="/partners">Acessar nossos parceiros oficiais</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">Acessar nossos produtos oficiais</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="gap-2 border-[#b02a20]/20 text-[#b02a20]">
                <Link href="https://cpadbelem.com.br/" target="_blank">
                  Loja virtual CPAD
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-[#b02a20]/20 bg-[#fff7f2]/95 p-5 text-[#2d1c16]">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#b02a20]">
                Curadoria CPAD
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="mt-3 text-2xl font-semibold leading-tight">
                Transparência para indicar a clientes e igrejas
              </h2>
              <p className="mt-2 text-sm text-neutral-700">
                Links acompanhados, parceiros verificados e produtos oficiais publicados pelo nosso
                time. Navegue pelas listas e escolha com confiança.
              </p>
              <div className="mt-5 grid gap-2 rounded-2xl bg-white p-3">
                <FeaturePill text="Parceiros avaliados e homologados" />
                <FeaturePill text="Produtos oficiais com origem confiável" />
                <FeaturePill text="Monitoramento de cliques e performance" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                <Badge className="bg-[#fff0e6] text-[#9a231a]">Rede CPAD</Badge>
                <Badge variant="outline" className="text-[#9a231a]">
                  Confiança e segurança
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

function FeaturePill({ text }: { text: string }) {
  return (
    <span className="inline-flex w-full items-center gap-2 rounded-full border border-[#b02a20]/15 bg-white px-3 py-2 text-sm text-[#2d1c16] shadow-sm sm:w-auto">
      <Sparkles className="h-4 w-4 text-[#b02a20]" />
      {text}
    </span>
  );
}
