import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  Gift,
  HeartPulse,
  Home,
  Laptop,
  Music2,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { CategoryOption } from "@/lib/data/categories";

const iconBySlug: Record<string, LucideIcon> = {
  "livros-e-educacao": BookOpen,
  "presentes-e-decoracao": Gift,
  "moda-crista": Shirt,
  "casa-e-lar": Home,
  "musica-e-som": Music2,
  servicos: Wrench,
  tecnologia: Laptop,
  "saude-e-bem-estar": HeartPulse,
  alimentacao: UtensilsCrossed,
  "negocios-e-consultoria": BriefcaseBusiness,
};

export function CategoryExplorer({ categories }: { categories: CategoryOption[] }) {
  if (!categories.length) return null;

  return (
    <section aria-labelledby="categories-title" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Comece por aqui</p>
            <h2 id="categories-title" className="mt-1 font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)]">Explore por categoria</h2>
          </div>
          <Link href="/parceiros" className="hidden text-sm font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-wine-dark)] sm:block">
            Ver diretório
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {categories.map((category, index) => {
            const Icon = iconBySlug[category.slug] ?? Sparkles;
            const inverted = index % 2 === 0;
            return (
              <Link
                key={category.id}
                href={`/parceiros?category=${encodeURIComponent(category.slug)}`}
                className="group flex min-h-32 flex-col items-center justify-center gap-3 px-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
              >
                <span className={`flex h-15 w-15 items-center justify-center rounded-full border transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card)] ${inverted ? "border-[var(--color-wine)] bg-[var(--color-wine)] text-white" : "border-[var(--color-gold)] bg-[var(--color-gold)] text-white"}`}>
                  <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-sm font-semibold leading-5 text-[var(--color-text)] group-hover:text-[var(--color-wine)]">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
