import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const navItems = [
  { label: "Visao geral", href: "/admin/overview", icon: "overview" },
  { label: "Categorias", href: "/admin/categories", icon: "categories" },
  { label: "Parceiros", href: "/admin/partners", icon: "partners" },
  { label: "Produtos", href: "/admin/products", icon: "products" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if (!isAdminEmail(session.user?.email)) {
    redirect("/");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-10 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Painel</p>
            <p className="text-lg font-semibold">Nosite Admin</p>
          </div>
        </div>

        <AdminSidebar navItems={navItems} />

        <div className="space-y-3 text-sm text-white/70">
          <p className="rounded-2xl border border-white/10 px-4 py-2">
            {session.user?.email}
          </p>
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" className="w-full">
              Sair
            </Button>
          </form>
        </div>
      </aside>

      <div className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/60 p-8">
        {children}
      </div>
    </div>
  );
}
