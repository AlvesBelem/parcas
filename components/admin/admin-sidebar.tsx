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

type NavItem = {
  label: string;
  href: string;
  icon: IconKey;
};

type AdminSidebarProps = {
  navItems: readonly NavItem[];
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
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white",
              isActive && "bg-white/10 text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
