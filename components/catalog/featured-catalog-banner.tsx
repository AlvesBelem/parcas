"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package, Pause, Play, Sparkles, Store, Wrench } from "lucide-react";

import type { FeaturedCatalogBanner } from "@/lib/data/featured-banners";

const targetLabels = {
  PARTNER: "Loja em destaque",
  PRODUCT: "Produto em destaque",
  SERVICE: "Serviço em destaque",
} as const;

export function FeaturedCatalogBanner({ banners }: { banners: FeaturedCatalogBanner[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  const activeBannerIndex = Math.min(activeIndex, Math.max(banners.length - 1, 0));
  const banner = banners[activeBannerIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (banners.length < 2 || isManuallyPaused || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [banners.length, isManuallyPaused, prefersReducedMotion]);

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateVisibility = () => {
      const headerHeight = window.matchMedia("(min-width: 1024px)").matches ? 88 : 72;
      const shouldShow = window.scrollY > headerHeight;
      setShowStickyBanner((isVisible) => (isVisible === shouldShow ? isVisible : shouldShow));
    };

    const handleViewportChange = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateVisibility();
      });
    };

    updateVisibility();
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!banner) return null;

  const Icon = banner.targetType === "PARTNER" ? Store : banner.targetType === "PRODUCT" ? Package : Wrench;
  const move = (direction: -1 | 1) => setActiveIndex((current) => (current + direction + banners.length) % banners.length);

  return (
    <>
      {showStickyBanner ? (
        <section className="featured-sticky-banner fixed inset-x-0 top-0 z-[45] border-b border-[var(--color-gold-light)]/35 bg-[var(--color-wine-dark)] text-white shadow-[0_10px_28px_rgba(32,7,16,0.3)]" aria-label="Destaque atual do catálogo">
          <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-22 lg:px-8">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-[var(--color-gold-light)]/55 bg-white sm:h-12 sm:w-12" aria-hidden>
              <Image src={banner.imageUrl} alt="" fill className="object-contain p-1.5" sizes="48px" unoptimized />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)] sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{targetLabels[banner.targetType]}</span>
                {banners.length > 1 ? <span className="hidden text-white/65 sm:inline">{activeBannerIndex + 1}/{banners.length}</span> : null}
              </div>
              <p className="mt-0.5 truncate font-[family-name:var(--font-playfair)] text-base font-semibold leading-tight sm:text-lg">{banner.title}</p>
            </div>
            <Link href={banner.href} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 bg-[var(--color-gold-light)] px-3 text-xs font-extrabold text-[var(--color-wine-dark)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:min-h-11 sm:px-4 sm:text-sm" aria-label={`Acessar anúncio: ${banner.title}`}>
              <span className="sm:hidden">Ver</span>
              <span className="hidden sm:inline">Acessar anúncio</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      ) : null}
    <section className="relative isolate overflow-hidden bg-[var(--color-wine-dark)] px-4 py-8 text-white sm:px-6 sm:py-11 lg:px-8 lg:py-14" aria-roledescription="carrossel" aria-label="Destaques do catálogo">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_12%,rgba(241,199,125,0.34),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.07)_52%,transparent_53%)]" />
      <div key={banner.id} className="featured-banner-content mx-auto grid max-w-[1440px] gap-8 md:min-h-[390px] md:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)] md:items-center md:gap-10 lg:min-h-[410px] lg:grid-cols-[minmax(0,0.9fr)_minmax(390px,460px)] lg:gap-14">
        <div>
          <nav className="text-sm text-white/65" aria-label="Navegação estrutural">
            <Link href="/parceiros" className="transition hover:text-white">Catálogo</Link>
            <span className="px-2" aria-hidden>/</span>
            <span>Destaque</span>
          </nav>
          <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold-light)]">
            <Sparkles className="h-4 w-4" aria-hidden /> {targetLabels[banner.targetType]}
          </div>
          <div className="mt-4 flex h-5 items-center gap-2 text-sm text-white/72">
            <Icon className="h-4 w-4 text-[var(--color-gold-light)]" aria-hidden />
            <span className="min-w-0 truncate">{banner.category}</span>
          </div>
          <h1 className="mt-3 min-h-[5.625rem] max-w-3xl line-clamp-2 font-[family-name:var(--font-playfair)] text-4xl leading-tight sm:min-h-[7.5rem] sm:text-5xl lg:min-h-[9.375rem] lg:text-6xl">{banner.title}</h1>
          <p className="mt-4 min-h-[5.25rem] max-w-2xl line-clamp-3 text-base leading-7 text-white/80 sm:text-lg">{banner.description ?? "Conheça este destaque selecionado no catálogo CPAD Belém."}</p>
          <Link href={banner.href} className="mt-7 inline-flex min-h-11 items-center gap-2 bg-[var(--color-gold-light)] px-5 text-sm font-bold text-[var(--color-wine-dark)] transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            {banner.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <Link href={banner.href} className="group relative mx-auto flex aspect-[4/3] w-full max-w-[420px] items-center justify-center overflow-hidden border border-[var(--color-gold-light)]/60 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.32)] ring-1 ring-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:max-w-[460px]">
          <Image src={banner.imageUrl} alt={banner.title} fill className="object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-5" sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 320px, 460px" unoptimized />
          <span className="absolute bottom-0 left-0 right-0 bg-[var(--color-wine-dark)]/88 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white">Destaque CPAD Belém</span>
        </Link>
      </div>
      {banners.length > 1 ? (
        <div className="mx-auto mt-7 flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
          <p className="text-xs font-semibold text-white/70">Destaque {activeBannerIndex + 1} de {banners.length}</p>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => move(-1)} aria-label="Destaque anterior"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Selecionar destaque">
              {banners.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={index === activeBannerIndex} aria-label={`Mostrar destaque ${index + 1}: ${item.title}`} onClick={() => setActiveIndex(index)} className={`h-2.5 w-2.5 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === activeBannerIndex ? "bg-[var(--color-gold-light)]" : "bg-white/35 hover:bg-white/65"}`} />)}
            </div>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => setIsManuallyPaused((paused) => !paused)} aria-label={isManuallyPaused ? "Retomar rotação automática" : "Pausar rotação automática"}>{isManuallyPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}</button>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => move(1)} aria-label="Próximo destaque"><ArrowRight className="h-4 w-4" aria-hidden /></button>
          </div>
        </div>
      ) : null}
    </section>
    </>
  );
}
