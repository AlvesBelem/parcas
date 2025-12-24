import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";

const navItems = [
  { label: "Visão geral", href: "/admin/overview", icon: "overview" },
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
    redirect("/api/auth/signin?callbackUrl=/admin/overview");
  }

  if (!isAdminEmail(session.user?.email)) {
    redirect("/");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.28em] text-[#b02a20]">Painel seguro</p>
        <h1 className="text-2xl font-semibold text-[#2d1c16]">Administração CPAD Belém</h1>
        <p className="text-sm text-neutral-600">
          Gerencie parceiros, produtos e categorias com visão consolidada.
        </p>
      </div>

      <AdminMobileMenu navItems={navItems} />
      <div className="grid min-h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:sticky lg:top-8 lg:block">
          <Card className="h-full border-[#b02a20]/15 bg-gradient-to-b from-[#fff0e6] to-white">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b02a20]/12 text-[#b02a20]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Painel</p>
                <CardTitle className="text-xl text-[#2d1c16]">Nosite Admin</CardTitle>
                <CardDescription>Controle central das operações.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminSidebar navItems={navItems} />
              <div className="rounded-2xl border border-[#b02a20]/15 bg-white p-4 text-sm text-neutral-700 shadow-sm">
                <p className="mb-3 truncate font-semibold text-[#2d1c16]">
                  {session.user?.email}
                </p>
                <form action={handleSignOut}>
                  <Button type="submit" variant="secondary" className="w-full">
                    Sair
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-4 pb-12">{children}</div>
      </div>
    </div>
  );
}
