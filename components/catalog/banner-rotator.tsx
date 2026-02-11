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
  const frameBgClass = treatAsLogo ? "bg-white/75" : "bg-white/85";
  const overlayClass = treatAsLogo
    ? "bg-gradient-to-t from-white/85 via-transparent to-transparent"
    : "bg-gradient-to-t from-white/75 via-transparent to-transparent";
  const imageClass = treatAsLogo
    ? "object-contain p-8 lg:p-12 drop-shadow-[0_25px_45px_rgba(0,0,0,0.12)]"
    : "object-cover opacity-95";

  const move = (direction: number) => {
    if (!safeItems.length) return;
    setIndex((prev) => (prev + direction + safeItems.length) % safeItems.length);
  };

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#e6d5c9] bg-linear-to-br from-[#fff5ee] via-[#ffe9db] to-[#ffd9c7] text-[#2f1d15] shadow-[0_25px_70px_rgba(63,33,25,0.18)] min-h-[460px]">
      <DecoGlow />

      <div className="relative grid gap-8 px-6 py-9 text-center sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:text-left">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b5b45] lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f3c6b5] bg-white px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#e17a52]" />
              {current.badge ?? "Destaque"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#cfe8d4] bg-[#e9f7ef] px-3 py-1 text-[#1b7b41] shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verificado
            </span>
          </div>

          <h3
            className="text-3xl font-semibold leading-tight text-[#2f1d15] drop-shadow-sm sm:text-4xl line-clamp-2 min-h-[64px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {current.title}
          </h3>
          <p className="mx-auto max-w-2xl text-base text-[#5a3e32] lg:mx-0 line-clamp-3 min-h-[72px]">
            {current.caption ?? ""}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-[#9b5b45] lg:justify-start">
            {highlightTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#f0d3c1] bg-white px-3 py-1 uppercase tracking-[0.18em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href={current.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#b02b24] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(176,43,36,0.22)] transition hover:-translate-y-0.5 hover:bg-[#9a1f1a]"
            >
              Acessar agora
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-[#f3c6b5] bg-white px-3 py-1.5">
              {safeItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === index ? "w-8 bg-[#b02b24]" : "bg-[#f4b7a6] hover:bg-[#e17a52]"
                  }`}
                  aria-label={`Ir para banner ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-white/65 to-transparent blur-3xl" aria-hidden />
          <div
            className={`relative overflow-hidden rounded-3xl border border-[#f0d3c1] ${frameBgClass} backdrop-blur-lg shadow-[0_24px_60px_rgba(63,33,25,0.2)]`}
          >
            <div className="relative h-[220px] w-full sm:h-[260px] lg:h-80">
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
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#f3c6b5] bg-white px-4 py-3 text-sm text-[#3f2b22] shadow-[0_18px_40px_rgba(63,33,25,0.18)] backdrop-blur">
              <p className="font-semibold">{current.title}</p>
              <p className="text-xs text-[#7a5a4b]">Link auditado e clique seguro com a equipe CPAD Belém.</p>
            </div>
          </div>
        </div>
      </div>

      {safeItems.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-[#b02b24] shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-[55%] hover:bg-white"
            aria-label="Anterior"
            onClick={() => move(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-[#b02b24] shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-[55%] hover:bg-white"
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

