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
    <div className="mx-auto w-full max-w-[95vw] space-y-6 px-3 sm:px-4 lg:px-6">
      <AdminMobileMenu navItems={navItems} />
      <div className="grid min-h-[calc(100vh-160px)] grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-8">
          <Card className="h-full border-white/10 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-black">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Painel
                </p>
                <CardTitle className="text-xl text-white">Nosite Admin</CardTitle>
                <CardDescription>Controle central das operacoes.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminSidebar navItems={navItems} />
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                <p className="mb-3 truncate text-white">{session.user?.email}</p>
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
