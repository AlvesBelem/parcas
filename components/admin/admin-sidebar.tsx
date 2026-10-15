"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, LayoutDashboard, Package, Store, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

type IconKey = "overview" | "categories" | "partners" | "products" | "services";

const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  categories: Layers,
  partners: Store,
  products: Package,
  services: Wrench,
};

const descriptions: Record<IconKey, string> = {
  overview: "Acompanhar a operação",
  categories: "Organizar a navegação",
  partners: "Gerir lojas publicadas",
  products: "Gerir o catálogo legado",
  services: "Gerir atendimento publicado",
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconKey;
};

type AdminSidebarProps = {
  navItems: readonly AdminNavItem[];
};

export function AdminSidebar({ navItems }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Navegação da administração">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = iconMap[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex min-h-15 items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
              isActive && "border-[var(--color-gold)] bg-[var(--color-surface-warm)] text-[var(--color-wine)]",
            )}
          >
            <span className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition",
              isActive && "border-[var(--color-wine)] bg-[var(--color-wine)] text-white",
              "group-hover:border-[var(--color-wine)] group-hover:text-[var(--color-wine)]",
            )}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-bold">{item.label}</span>
              <span className="mt-0.5 block truncate text-xs font-normal text-[var(--color-text-subtle)]">{descriptions[item.icon]}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
