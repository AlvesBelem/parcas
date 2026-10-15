import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[var(--color-border)] bg-[var(--color-wine-dark)] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-9 px-4 py-11 sm:px-6 md:grid-cols-[1.25fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Image
            src="/logo_cpad_belem.svg"
            alt="CPAD Belém"
            width={170}
            height={60}
            className="h-auto w-38 brightness-0 invert"
          />
          <p className="max-w-sm text-sm leading-6 text-white/72">
            Uma vitrine para aproximar pessoas, empresas e serviços que compartilham valores.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
            Diretório
          </h2>
          <nav className="mt-4 grid gap-2 text-sm text-white/80" aria-label="Links do rodapé">
            <Link className="w-fit transition hover:text-white" href="/parceiros">
              Lojas parceiras
            </Link>
            <Link className="w-fit transition hover:text-white" href="/produtos">
              Produtos
            </Link>
            <span className="text-white/45" aria-disabled="true">
              Serviços — em breve
            </span>
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
            Atendimento
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            <a className="flex items-start gap-2 transition hover:text-white" href="tel:+5591981271407">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" aria-hidden />
              (91) 98127-1407
            </a>
            <a className="flex items-start gap-2 transition hover:text-white" href="mailto:parcerias@cpadbelem.com.br">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" aria-hidden />
              parcerias@cpadbelem.com.br
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" aria-hidden />
              Belém, Pará
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-4 py-4 text-xs text-white/60 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} CPAD Belém. Todos os direitos reservados.</p>
          <p>Plataforma de divulgação de parceiros.</p>
        </div>
      </div>
    </footer>
  );
}
