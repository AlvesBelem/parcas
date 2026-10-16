import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileImage,
  LayoutPanelTop,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Star,
  Store,
  UsersRound,
} from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Seja um Parceiro",
  description: "Conheça o Programa de Parceiros CPAD Belém: vitrine digital, cadastro assistido e opções de visibilidade para sua empresa.",
  alternates: { canonical: "/seja-um-parceiro" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/seja-um-parceiro"),
    title: "Seja um Parceiro | CPAD Belém",
    description: "Entenda como participar do Programa de Parceiros CPAD Belém e dar mais visibilidade à sua empresa.",
    images: [{ url: absoluteUrl("/programa-parceiros-ilustracao.png"), alt: "Programa de Parceiros CPAD Belém" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seja um Parceiro | CPAD Belém",
    description: "Entenda como participar do Programa de Parceiros CPAD Belém.",
    images: [absoluteUrl("/programa-parceiros-ilustracao.png")],
  },
};

const whatsappHref = `https://wa.me/55919991271407?text=${encodeURIComponent("Quero me tornar um parceiro, como funciona?")}`;

const vitrineItems = [
  { icon: Store, text: "Logomarca, nome e descrição da empresa" },
  { icon: MapPin, text: "Endereço, localização e canais de contato" },
  { icon: MessageCircle, text: "Telefone, WhatsApp, redes sociais e loja virtual" },
  { icon: LayoutPanelTop, text: "Produtos, serviços, imagens e informações comerciais" },
] as const;

const onboardingSteps = [
  {
    number: "01",
    title: "Entre em contato",
    text: "Manifeste seu interesse em participar do Programa de Parceiros CPAD Belém.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Escolha sua modalidade",
    text: "Contrate a participação mensal e, se desejar, acrescente a Visibilidade em Destaque.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Envie suas informações",
    text: "Encaminhe dados da empresa, logomarca, imagens, produtos, serviços e canais de contato.",
    icon: FileImage,
  },
  {
    number: "04",
    title: "Preparamos sua vitrine",
    text: "Nossa equipe organiza as informações e realiza o cadastro, sujeito à análise e aprovação.",
    icon: LayoutPanelTop,
  },
  {
    number: "05",
    title: "Entre para a rede",
    text: "Com pagamento confirmado e cadastro aprovado, sua vitrine é publicada na plataforma.",
    icon: UsersRound,
  },
] as const;

const faqs = [
  {
    question: "Preciso ter uma loja virtual para participar?",
    answer: "Não. Empresas com lojas físicas, negócios digitais e prestadores de serviços podem participar. Se não possuir loja virtual, seus clientes poderão entrar em contato pelos canais cadastrados.",
  },
  {
    question: "Preciso cadastrar meus próprios produtos?",
    answer: "Não. Nossa equipe realiza o cadastro inicial com base nas informações que você fornecer.",
  },
  {
    question: "Posso participar sem contratar o destaque?",
    answer: "Sim. A assinatura regular oferece uma vitrine para sua empresa ser encontrada. A Visibilidade em Destaque é um serviço adicional e opcional.",
  },
  {
    question: "O destaque garante que minha empresa ficará sempre na primeira posição?",
    answer: "Não. Os parceiros em destaque recebem prioridade nas listagens, mas as posições podem variar conforme a rotação e a organização da plataforma.",
  },
  {
    question: "Meu banner ficará aparecendo o tempo todo?",
    answer: "Não. O banner é rotativo e compartilhado com outros parceiros que contrataram o serviço. A frequência de exibição depende da quantidade de anunciantes ativos.",
  },
  {
    question: "Posso contratar o destaque depois de já ser parceiro?",
    answer: "Sim, desde que existam espaços disponíveis para o período desejado.",
  },
  {
    question: "A CPAD Belém realiza as vendas dos meus produtos?",
    answer: "Não. A plataforma divulga sua empresa e facilita o contato com potenciais clientes. Negociações, pagamentos, entregas e serviços são responsabilidade de cada parceiro.",
  },
  {
    question: "A participação garante novos clientes ou vendas?",
    answer: "Não. O programa cria oportunidades de exposição e conexão comercial, mas não garante quantidade de visitas, contatos ou vendas.",
  },
] as const;

export default function SejaUmParceiroPage() {
  return (
    <div className="space-y-16 pb-4 sm:space-y-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": absoluteUrl("/seja-um-parceiro"),
              url: absoluteUrl("/seja-um-parceiro"),
              name: "Seja um Parceiro | CPAD Belém",
              description: metadata.description,
              inLanguage: siteConfig.language,
              isPartOf: { "@id": `${absoluteUrl("/")}#website` },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
            {
              "@type": "HowTo",
              name: "Como participar do Programa de Parceiros CPAD Belém",
              description: "Etapas para contratar e publicar uma vitrine no Programa de Parceiros CPAD Belém.",
              step: onboardingSteps.map(({ number, title, text }) => ({
                "@type": "HowToStep",
                position: Number(number),
                name: title,
                text,
              })),
            },
          ],
        }}
      />
      <section className="overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface-warm) shadow-(--shadow-card)">
        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="relative z-10 flex flex-col justify-center bg-[linear-gradient(145deg,var(--color-wine-dark),var(--color-wine)_62%,#95133a)] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-12 lg:py-20">
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_18%_12%,rgba(241,199,125,0.55),transparent_23%),radial-gradient(circle_at_90%_88%,rgba(255,255,255,0.16),transparent_28%)]" />
            <div className="relative max-w-xl">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-(--color-gold-light)">
                <Sparkles className="h-4 w-4" aria-hidden /> Programa de Parceiros
              </p>
              <h1 className="mt-5 font-(family-name:--font-playfair) text-4xl font-bold leading-[0.98] sm:text-5xl xl:text-6xl">
                Sua empresa merece mais visibilidade.
              </h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-7 text-white/90 sm:text-xl">
                Juntos, podemos ir mais longe.
              </p>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/78 sm:text-base">
                Uma vitrine digital para apresentar sua marca, divulgar produtos e serviços e criar novas oportunidades para o seu negócio.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-(--color-gold-light) px-5 text-sm font-extrabold text-(--color-wine-dark) transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Quero ser parceiro <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="#destaque"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/35 px-5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Conhecer o destaque <ChevronDown className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <div className="relative min-h-80 lg:min-h-full">
            <Image
              src="/programa-parceiros-ilustracao.png"
              alt="Empreendedores conectados a uma vitrine digital de negócios"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[63%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(81,7,31,0.22),transparent_28%)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold)">Um espaço para sua empresa</p>
        <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight text-(--color-text) sm:text-4xl">
          Você cuida do seu negócio. Nós cuidamos da sua divulgação.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-(--color-text-muted)">
          O Programa de Parceiros CPAD Belém conecta empresas, empreendedores e prestadores de serviços a pessoas que procuram soluções, qualidade e confiança.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative overflow-hidden rounded-3xl bg-(--color-surface-warm) p-7 sm:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--color-gold-light)/35 blur-2xl" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-wine) text-(--color-gold-light) shadow-[0_12px_28px_rgba(117,11,42,0.2)]">
              <LayoutPanelTop className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-6 font-(family-name:--font-playfair) text-3xl font-bold text-(--color-text)">
              Uma vitrine digital feita para ser encontrada.
            </h2>
            <p className="mt-4 text-sm leading-6 text-(--color-text-muted)">
              Ao aderir, sua empresa ganha uma página profissional dentro da plataforma, acessível em computadores, tablets e celulares.
            </p>
            <div className="mt-7 rounded-2xl border border-(--color-border) bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-(--color-border) pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-wine) text-sm font-bold text-white">S</span>
                <div className="min-w-0">
                  <div className="h-2.5 w-32 rounded-full bg-(--color-text)/15" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-(--color-gold)/45" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <span className="h-14 rounded-xl bg-(--color-wine)/12" />
                <span className="h-14 rounded-xl bg-(--color-gold)/24" />
                <span className="h-14 rounded-xl bg-(--color-wine)/12" />
              </div>
              <span className="mt-4 block h-9 rounded-xl bg-(--color-wine)" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold)">O que sua página pode reunir</p>
          <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight text-(--color-text) sm:text-4xl">
            Informações claras para seus futuros clientes.
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {vitrineItems.map(({ icon: Icon, text }) => (
              <div key={text} className="flex gap-3 rounded-2xl border border-(--color-border) bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-warm) text-(--color-wine)">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="self-center text-sm font-semibold leading-5 text-(--color-text)">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold)">Cadastro assistido</p>
            <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight text-(--color-text)">
              Nós fazemos o cadastro para você.
            </h2>
            <p className="mt-5 text-sm leading-6 text-(--color-text-muted)">
              Você não precisa se preocupar com sistemas, configurações ou conhecimentos técnicos. Após a contratação, basta enviar as informações e imagens solicitadas.
            </p>
            <div className="mt-6 flex gap-3 rounded-2xl bg-(--color-surface-warm) p-4">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--color-wine)" aria-hidden />
              <p className="text-sm font-semibold leading-6 text-(--color-text)">
                Nossa equipe cadastra, organiza e publica sua empresa. Atualizações podem ser solicitadas conforme as condições do plano contratado.
              </p>
            </div>
          </div>
          <ol className="relative grid gap-3 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-(--color-border) sm:grid-cols-5 sm:before:bottom-auto sm:before:left-10 sm:before:right-10 sm:before:top-10 sm:before:h-px sm:before:w-auto">
            {onboardingSteps.map(({ number, title, text, icon: Icon }) => (
              <li key={number} className="relative flex gap-4 sm:block sm:pr-2">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-wine) text-(--color-gold-light) shadow-[0_8px_16px_rgba(117,11,42,0.18)] sm:mx-auto">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="pt-1 sm:pt-4">
                  <p className="text-xs font-extrabold tracking-[0.14em] text-(--color-gold)">{number}</p>
                  <h3 className="mt-1 text-sm font-extrabold leading-5 text-(--color-text)">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-(--color-text-muted)">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="destaque" className="scroll-mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--color-wine-dark),var(--color-wine)_62%,#8c1235)] px-6 py-9 text-white shadow-[0_18px_42px_rgba(81,7,31,0.2)] sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="relative">
            <div className="absolute -left-14 -top-12 h-48 w-48 rounded-full bg-(--color-gold)/25 blur-3xl" />
            <div className="relative flex h-44 items-center justify-center sm:h-52">
              <div className="absolute h-36 w-36 rounded-full border border-(--color-gold-light)/35" />
              <div className="absolute h-52 w-52 rounded-full border border-(--color-gold-light)/20" />
              <Image src="/estrela.png" alt="Estrela dourada do parceiro em destaque" width={192} height={192} className="featured-card-star relative z-10 h-32 w-32 object-contain sm:h-40 sm:w-40" />
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold-light)">Visibilidade em destaque</p>
            <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight sm:text-4xl">
              Quer ainda mais visibilidade para a sua empresa?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
              Além da participação regular, você pode contratar o serviço opcional de Visibilidade em Destaque para ganhar presença adicional nas áreas mais vistas da plataforma.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <HighlightBenefit icon={LayoutPanelTop} title="Banner rotativo" text="Sua marca ganha espaço em uma área de destaque do portal." />
              <HighlightBenefit icon={BarChart3} title="Prioridade nos cards" text="Mais facilidade para ser encontrado nas listagens." />
              <HighlightBenefit icon={Star} title="Estrela dourada" text="Um sinal visual de maior exposição publicitária." />
            </div>
            <p className="mt-5 text-xs leading-5 text-white/60">
              A estrela indica a contratação de maior exposição, não uma certificação de qualidade ou garantia de resultados.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold)">Escolha sua modalidade</p>
          <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold text-(--color-text) sm:text-4xl">
            Parceiro regular ou parceiro em destaque?
          </h2>
          <p className="mt-4 text-sm leading-6 text-(--color-text-muted)">Compare os benefícios e encontre a opção mais adequada para o momento do seu negócio.</p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-(--color-border) bg-white shadow-(--shadow-card)">
          <table className="min-w-160 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-surface-warm)">
                <th scope="col" className="px-5 py-4 font-extrabold text-(--color-text)">Benefícios</th>
                <th scope="col" className="px-5 py-4 text-center font-extrabold text-(--color-text)">Parceiro regular</th>
                <th scope="col" className="bg-(--color-wine) px-5 py-4 text-center font-extrabold text-white">Parceiro em destaque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {[
                "Página exclusiva da empresa",
                "Divulgação de produtos e serviços",
                "Endereço e contatos",
                "WhatsApp e link da loja virtual",
                "Presença nas categorias e buscas",
              ].map((benefit) => <ComparisonRow key={benefit} benefit={benefit} />)}
              {[
                "Banner rotativo",
                "Prioridade nos cards",
                "Estrela dourada no card",
              ].map((benefit) => <ComparisonRow key={benefit} benefit={benefit} highlighted />)}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs leading-5 text-(--color-text-subtle)">A Visibilidade em Destaque possui cobrança adicional e está sujeita à disponibilidade e ao período contratado.</p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="rounded-3xl bg-(--color-surface-warm) p-7 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-wine) text-(--color-gold-light)">
            <Search className="h-6 w-6" aria-hidden />
          </span>
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-gold)">Dúvidas frequentes</p>
          <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight text-(--color-text)">
            Transparência em cada etapa.
          </h2>
          <p className="mt-4 text-sm leading-6 text-(--color-text-muted)">
            Reunimos as perguntas mais comuns para você tomar sua decisão com clareza.
          </p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--color-wine) px-4 text-sm font-bold text-(--color-wine) transition hover:bg-(--color-wine) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)">
            Falar com a equipe <Send className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <div className="divide-y divide-(--color-border) overflow-hidden rounded-3xl border border-(--color-border) bg-white shadow-(--shadow-card)">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group p-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-(--color-text) marker:hidden [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown className="h-5 w-5 shrink-0 text-(--color-wine) transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pr-8 pt-3 text-sm leading-6 text-(--color-text-muted)">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-(--color-gold)/45 bg-[linear-gradient(135deg,#fff8e9,var(--color-surface-warm)_62%,#f7e4c1)] px-6 py-12 text-center sm:px-10 sm:py-16">
        <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-(--color-gold)/16 blur-3xl" />
        <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-(--color-wine)/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-(--color-wine)">Faça parte da rede</p>
          <h2 className="mt-3 font-(family-name:--font-playfair) text-3xl font-bold leading-tight text-(--color-text) sm:text-5xl">
            Sua empresa tem muito a oferecer.
          </h2>
          <p className="mt-5 text-base leading-7 text-(--color-text-muted)">
            Seja um Parceiro CPAD Belém e descubra novas oportunidades para o seu negócio. Juntos, levando o Reino mais longe.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-(--color-wine) px-6 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(117,11,42,0.24)] transition hover:-translate-y-0.5 hover:bg-(--color-wine-dark) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-focus)">
              Quero ser parceiro <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link href="/parceiros" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-(--color-wine) bg-white/70 px-6 text-sm font-bold text-(--color-wine) transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-focus)">
              Conhecer parceiros <Store className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HighlightBenefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof LayoutPanelTop;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/16 bg-white/8 p-4 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-(--color-gold-light)" aria-hidden />
      <h3 className="mt-3 text-sm font-extrabold">{title}</h3>
      <p className="mt-1.5 text-xs leading-5 text-white/70">{text}</p>
    </div>
  );
}

function ComparisonRow({ benefit, highlighted = false }: { benefit: string; highlighted?: boolean }) {
  return (
    <tr>
      <th scope="row" className="px-5 py-3.5 font-semibold text-(--color-text)">{benefit}</th>
      <td className="px-5 py-3.5 text-center text-(--color-text-subtle)">
        {highlighted ? "—" : <Check className="mx-auto h-5 w-5 text-(--color-wine)" strokeWidth={2.75} aria-label="Incluído" />}
      </td>
      <td className="bg-(--color-gold-light)/16 px-5 py-3.5 text-center">
        <span className="inline-flex items-center gap-1.5 font-bold text-(--color-wine)">
          {highlighted ? <Star className="h-4 w-4 fill-(--color-gold) text-(--color-gold)" aria-hidden /> : <Check className="h-5 w-5" strokeWidth={2.75} aria-hidden />}
          <span className="sr-only">Incluído</span>
        </span>
      </td>
    </tr>
  );
}
