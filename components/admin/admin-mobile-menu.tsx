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
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-3xl border border-[#b02a20]/20 bg-white px-5 py-4 text-left text-[#2d1c16] shadow-[0_14px_40px_rgba(45,28,22,0.08)]"
        aria-expanded={open}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Menu</p>
          <p className="text-lg font-semibold">Navegação do admin</p>
        </div>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div
        className={cn(
          "overflow-hidden rounded-3xl border border-[#b02a20]/20 bg-[#fff7f2] shadow-[0_14px_40px_rgba(45,28,22,0.08)] transition-all",
          open ? "mt-4 max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className={cn(open ? "p-4" : "p-0")}>
          <AdminSidebar navItems={navItems} />
        </div>
      </div>
    </div>
  );
}
