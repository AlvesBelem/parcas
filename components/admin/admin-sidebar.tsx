"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, LayoutDashboard, Store, Package } from "lucide-react";

import { cn } from "@/lib/utils";

type IconKey = "overview" | "categories" | "partners" | "products";

const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  categories: Layers,
  partners: Store,
  products: Package,
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
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = iconMap[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-[#b02a20]/25 hover:bg-[#fff0e6]",
              isActive && "border-[#b02a20]/40 bg-[#fff0e6] text-[#b02a20] shadow-sm",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-[#b02a20]/20 bg-white transition",
                isActive ? "text-[#b02a20]" : "group-hover:border-[#b02a20]/30",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span>{item.label}</span>
              <span className="text-xs text-neutral-500">
                {item.icon === "overview" && "Painel"}
                {item.icon === "categories" && "Organize listas"}
                {item.icon === "partners" && "Gestão de parceiros"}
                {item.icon === "products" && "Ofertas afiliadas"}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
