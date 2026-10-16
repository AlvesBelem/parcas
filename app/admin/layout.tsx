import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";

const navItems = [
  { label: "Visão geral", href: "/admin/overview", icon: "overview" },
  { label: "Categorias", href: "/admin/categories", icon: "categories" },
  { label: "Parceiros", href: "/admin/partners", icon: "partners" },
  { label: "Produtos", href: "/admin/products", icon: "products" },
  { label: "Serviços", href: "/admin/services", icon: "services" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Foverview");
  }

  if (!isAdminEmail(session.user?.email)) {
    redirect("/acesso-negado");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div id="admin-theme-root" className="-mx-4 -mt-8 min-h-full bg-(--color-surface) sm:-mx-6 sm:-mt-10 lg:-mx-8 lg:-mt-12">
      <div className="border-b border-white/15 bg-(--color-wine-dark) text-white">
        <div className="mx-auto flex max-w-360 items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-(--color-gold-light)/50 bg-white/10 text-(--color-gold-light)">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-(--color-gold-light)">Área restrita</p>
              <p className="truncate font-(family-name:--font-playfair) text-xl">Administração CPAD Belém</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AdminThemeToggle />
            <form action={handleSignOut}>
              <Button type="submit" variant="secondary" size="sm" className="border-white/25 bg-transparent text-white hover:border-white hover:bg-white/10">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <AdminMobileMenu navItems={navItems} />
        <div className="grid min-h-[calc(100vh-260px)] grid-cols-1 gap-6 lg:grid-cols-[258px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 border border-(--color-border) bg-white p-3 shadow-(--shadow-card)">
              <div className="border-b border-(--color-border) px-3 pb-4 pt-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--color-wine)">Navegação</p>
                <p className="mt-1 text-sm text-(--color-text-muted)">Gerencie a vitrine e o catálogo.</p>
              </div>
              <div className="py-3"><AdminSidebar navItems={navItems} /></div>
              <div className="border-t border-(--color-border) px-3 pb-2 pt-4">
                <p className="truncate text-sm font-semibold text-(--color-text)">{session.user?.email}</p>
                <p className="mt-1 text-xs text-(--color-text-subtle)">Conta com acesso administrativo</p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 pb-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
