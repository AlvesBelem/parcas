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
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
      <AdminMobileMenu navItems={navItems} />
      <div className="grid min-h-[calc(100vh-160px)] grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:sticky lg:top-8 lg:block">
          <Card className="h-full border-[#eaded5] bg-white shadow-[0_18px_55px_rgba(63,33,25,0.1)]">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdefec] text-[#b02b24]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#b02b24]/80">Painel</p>
                <CardTitle className="text-xl text-[#2f1d15]">CPAD Admin</CardTitle>
                <CardDescription>Controle central das operações.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminSidebar navItems={navItems} />
              <div className="rounded-2xl border border-[#eaded5] bg-[#fff8f3] p-4 text-sm text-[#7a5a4b]">
                <p className="mb-3 truncate text-[#2f1d15]">{session.user?.email}</p>
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
