"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const move = (direction: number) => {
    if (!safeItems.length) return;
    setIndex((prev) => (prev + direction + safeItems.length) % safeItems.length);
  };

  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#e9c9b8] bg-gradient-to-br from-[#1c0f0c] via-[#2d1813] to-[#521c15] text-white shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
      <DecoGlow />

      <div className="relative grid gap-6 px-6 py-8 text-center sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-10">
        <div className="space-y-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
            <span className="h-2 w-2 rounded-full bg-[#ffcf9c]" />
            {current.badge ?? "Destaque"}
          </div>
          <h3
            className="text-3xl font-semibold leading-tight drop-shadow-sm sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {current.title}
          </h3>
          {current.caption && (
            <p className="mx-auto max-w-2xl text-base text-white/85">
              {current.caption}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={current.href}
              className="inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold text-[#b02b24] px-5 py-2.5 shadow-[0_14px_34px_rgba(255,255,255,0.3)] transition hover:-translate-y-0.5 hover:bg-[#fff6ef]"
            >
              Acessar agora
            </Link>
            <div className="flex items-center gap-2">
              {safeItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === index ? "w-7 bg-white" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir para banner ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-[0_18px_48px_rgba(0,0,0,0.25)]">
            <div className="relative h-[220px] w-full sm:h-[260px] lg:h-[320px]">
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-[#1c0f0c]/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {safeItems.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/90 text-[#b02b24] shadow-lg transition hover:-translate-y-[55%] hover:bg-white"
            aria-label="Anterior"
            onClick={() => move(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/90 text-[#b02b24] shadow-lg transition hover:-translate-y-[55%] hover:bg-white"
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
