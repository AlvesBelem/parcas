import Link from "next/link";
import { Filter, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  label?: string;
};

export type CatalogTypeOption = {
  value: string;
  label: string;
};

type CatalogHeroProps = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
};

export function CatalogHero({ breadcrumb, eyebrow, title, highlight, description }: CatalogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-wine-dark)] px-4 py-11 text-white sm:px-6 lg:px-8 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(241,199,125,0.34),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_55%,transparent_56%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <nav className="text-sm text-white/65" aria-label="Navegação estrutural">
          <Link href="/parceiros" className="transition hover:text-white">Catálogo</Link>
          <span className="px-2" aria-hidden>/</span>
          <span>{breadcrumb}</span>
        </nav>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold-light)]">{eyebrow}</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-5xl leading-none sm:text-6xl">
          {title} <span className="text-[var(--color-gold-light)]">{highlight}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}

type CatalogFilterPanelProps = {
  action: string;
  title: string;
  searchLabel: string;
  searchPlaceholder: string;
  initialSearch?: string;
  categories: CatalogCategory[];
  initialCategory?: string;
  categoryLabel: string;
  typeOptions?: CatalogTypeOption[];
  initialType?: string;
  submitLabel?: string;
};

export function CatalogFilterPanel({
  action,
  title,
  searchLabel,
  searchPlaceholder,
  initialSearch,
  categories,
  initialCategory,
  categoryLabel,
  typeOptions,
  initialType,
  submitLabel = "Aplicar filtros",
}: CatalogFilterPanelProps) {
  return (
    <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-6" aria-label={`Filtros de ${title.toLowerCase()}`}>
      <div className="flex items-center gap-2 text-[var(--color-text)]">
        <Filter className="h-5 w-5 text-[var(--color-wine)]" aria-hidden />
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl">{title}</h2>
      </div>
      <form action={action} className="mt-5 space-y-6">
        <div>
          <label htmlFor={`${action.slice(1)}-search`} className="text-sm font-bold text-[var(--color-text)]">{searchLabel}</label>
          <div className="mt-2 flex border border-[var(--color-border-strong)] bg-white focus-within:ring-2 focus-within:ring-[var(--color-focus)]">
            <input
              id={`${action.slice(1)}-search`}
              name="q"
              type="search"
              defaultValue={initialSearch}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--color-text-subtle)]"
            />
            <span className="flex w-10 items-center justify-center text-[var(--color-wine)]"><Search className="h-4 w-4" aria-hidden /></span>
          </div>
        </div>

        {typeOptions?.length ? (
          <div>
            <label htmlFor={`${action.slice(1)}-type`} className="text-sm font-bold text-[var(--color-text)]">Exibir</label>
            <select
              id={`${action.slice(1)}-type`}
              name="type"
              defaultValue={initialType ?? "all"}
              className="mt-2 h-11 w-full border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            >
              {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor={`${action.slice(1)}-category`} className="text-sm font-bold text-[var(--color-text)]">Categoria</label>
          <select
            id={`${action.slice(1)}-category`}
            name="category"
            defaultValue={initialCategory ?? ""}
            className="mt-2 h-11 w-full border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          >
            <option value="">{categoryLabel}</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.label ?? category.name}</option>)}
          </select>
        </div>

        <Button type="submit" className="w-full"><Filter className="h-4 w-4" aria-hidden /> {submitLabel}</Button>
      </form>
    </aside>
  );
}

type CatalogResultsHeaderProps = {
  eyebrow: string;
  title: string;
  total: number;
  singular: string;
  plural: string;
  search?: string;
  hasFilters: boolean;
  resetHref: string;
};

export function CatalogResultsHeader({
  eyebrow,
  title,
  total,
  singular,
  plural,
  search,
  hasFilters,
  resetHref,
}: CatalogResultsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">{eyebrow}</p>
        <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)] sm:text-4xl">{title}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]" aria-live="polite">
          {total} {total === 1 ? singular : plural}{search ? ` para “${search}”` : ""}.
        </p>
      </div>
      {hasFilters ? (
        <Link href={resetHref} className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-bold text-[var(--color-wine)] underline decoration-[var(--color-gold)] underline-offset-4 transition hover:text-[var(--color-wine-dark)] sm:self-auto">
          <X className="h-4 w-4" aria-hidden /> Limpar filtros
        </Link>
      ) : null}
    </header>
  );
}

type CatalogEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  resetHref?: string;
  resetLabel?: string;
};

export function CatalogEmptyState({ icon: Icon, title, description, resetHref, resetLabel = "Limpar filtros" }: CatalogEmptyStateProps) {
  return (
    <div className="mt-6 border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-center sm:p-12">
      <Icon className="mx-auto h-8 w-8 text-[var(--color-wine)]" aria-hidden />
      <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      {resetHref ? <Button asChild variant="secondary" className="mt-5"><Link href={resetHref}>{resetLabel}</Link></Button> : null}
    </div>
  );
}

export function CatalogPageLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-12">
      {sidebar}
      <div className="min-w-0">{children}</div>
    </section>
  );
}
