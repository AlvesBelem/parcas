"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

export type BannerItem = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  badge?: string;
  caption?: string;
};

type BannerRotatorProps = {
  items: BannerItem[];
  intervalMs?: number;
};

// A fresh, editorial-style rotator: strong background gradient, framed image, clear CTA and bullets.
export function BannerRotator({ items, intervalMs = 5200 }: BannerRotatorProps) {
  const [index, setIndex] = useState(0);
  const safeItems = useMemo(() => (items.length ? items : []), [items]);

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [safeItems.length, intervalMs]);

  if (!safeItems.length) return null;

  const current = safeItems[index];
  const highlightTags = ["Curadoria humana", "Entrega monitorada", "Clique auditado"];
  const treatAsLogo = Boolean(
    current.imageUrl?.toLowerCase().match(/logo|marca|icon|svg/),
  );
  const frameBgClass = treatAsLogo ? "bg-white/8" : "bg-white/5";
  const overlayClass = treatAsLogo
    ? "bg-gradient-to-t from-[#2b120e]/65 via-transparent to-transparent"
    : "bg-gradient-to-t from-black/50 via-transparent to-transparent";
  const imageClass = treatAsLogo
    ? "object-contain p-8 lg:p-12 drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
    : "object-cover opacity-90";

  const move = (direction: number) => {
    if (!safeItems.length) return;
    setIndex((prev) => (prev + direction + safeItems.length) % safeItems.length);
  };

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#f4d2c4]/70 bg-gradient-to-br from-[#2b120e] via-[#3a1612] to-[#7b241b] text-white shadow-[0_30px_85px_rgba(0,0,0,0.35)]">
      <DecoGlow />

      <div className="relative grid gap-8 px-6 py-9 text-center sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:text-left">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#ffcf9c]" />
              {current.badge ?? "Destaque"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/65">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verificado
            </span>
          </div>

          <h3
            className="text-3xl font-semibold leading-tight drop-shadow-sm sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {current.title}
          </h3>
          {current.caption && (
            <p className="mx-auto max-w-2xl text-base text-white/85 lg:mx-0">
              {current.caption}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-white/80 lg:justify-start">
            {highlightTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 uppercase tracking-[0.18em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href={current.href}
              className="inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold text-[#b02b24] px-6 py-3 shadow-[0_20px_40px_rgba(255,255,255,0.32)] transition hover:-translate-y-0.5 hover:bg-[#fff5ef]"
            >
              Acessar agora
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              {safeItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === index ? "w-8 bg-white" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir para banner ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/15 to-transparent blur-3xl" aria-hidden />
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/15 ${frameBgClass} backdrop-blur-lg shadow-[0_32px_75px_rgba(0,0,0,0.35)]`}
          >
            <div className="relative h-[220px] w-full sm:h-[260px] lg:h-[320px]">
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                className={imageClass}
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
              <div className={`absolute inset-0 ${overlayClass}`} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="font-semibold">{current.title}</p>
              <p className="text-xs text-white/75">Link auditado e clique seguro com a equipe CPAD Belém.</p>
            </div>
          </div>
        </div>
      </div>

      {safeItems.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/85 text-[#b02b24] shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-[55%] hover:bg-white"
            aria-label="Anterior"
            onClick={() => move(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/85 text-[#b02b24] shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-[55%] hover:bg-white"
            aria-label="Próximo"
            onClick={() => move(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}

function DecoGlow() {
  return (
    <>
      <span className="pointer-events-none absolute -left-24 top-[-120px] h-64 w-64 rounded-full bg-[#ffb996]/30 blur-3xl" />
      <span className="pointer-events-none absolute right-[-140px] top-[-60px] h-72 w-72 rounded-full bg-[#ff7f6a]/25 blur-3xl" />
      <span className="pointer-events-none absolute left-20 bottom-[-120px] h-72 w-72 rounded-full bg-[#ffe0cc]/22 blur-3xl" />
    </>
  );
}

