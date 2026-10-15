import Link from "next/link";
import { LockKeyhole, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function AccessDeniedPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Foverview");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/api/auth/signin?callbackUrl=%2Fadmin%2Foverview" });
  }

  return (
    <section className="mx-auto max-w-xl py-8 sm:py-14">
      <div className="border border-(--color-border) bg-white p-7 text-center shadow-(--shadow-raised) sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-(--color-gold) bg-(--color-surface-warm) text-(--color-wine)">
          <LockKeyhole className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-(--color-wine)">Acesso administrativo</p>
        <h1 className="mt-2 font-(family-name:--font-playfair) text-4xl text-(--color-text)">Esta conta não possui acesso ao painel.</h1>
        <p className="mt-4 text-sm leading-6 text-(--color-text-muted)">
          Você entrou como <strong className="font-semibold text-(--color-text)">{session.user?.email ?? "conta sem e-mail"}</strong>. Peça a inclusão deste e-mail em <code className="bg-(--color-surface) px-1.5 py-0.5 text-(--color-wine)">ADMIN_EMAILS</code> ou entre com uma conta autorizada.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <form action={handleSignOut}>
            <Button type="submit" className="w-full sm:w-auto"><LogOut className="h-4 w-4" aria-hidden /> Usar outra conta</Button>
          </form>
          <Button asChild variant="secondary"><Link href="/">Voltar à vitrine</Link></Button>
        </div>
      </div>
    </section>
  );
}
