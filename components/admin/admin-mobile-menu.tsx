"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminSidebar, type AdminNavItem } from "@/components/admin/admin-sidebar";

type AdminMobileMenuProps = {
  navItems: readonly AdminNavItem[];
};

export function AdminMobileMenu({ navItems }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-5 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex min-h-13 w-full items-center justify-between border border-[var(--color-border)] bg-white px-4 text-left text-[var(--color-text)] shadow-[var(--shadow-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        aria-expanded={open}
        aria-controls="admin-mobile-navigation"
      >
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-wine)]">Administração</span>
          <span className="mt-0.5 block font-[family-name:var(--font-playfair)] text-xl">Menu do painel</span>
        </span>
        {open ? <X className="h-5 w-5 text-[var(--color-wine)]" aria-hidden /> : <Menu className="h-5 w-5 text-[var(--color-wine)]" aria-hidden />}
      </button>
      <div
        id="admin-mobile-navigation"
        className={cn(
          "overflow-hidden border-x border-b border-[var(--color-border)] bg-white transition-[max-height,opacity] duration-200",
          open ? "max-h-[420px] opacity-100" : "max-h-0 border-b-0 opacity-0",
        )}
      >
        <div className="p-3"><AdminSidebar navItems={navItems} /></div>
      </div>
    </div>
  );
}
