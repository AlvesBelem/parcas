"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createServiceCategory } from "@/lib/actions/service-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ServiceCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [state, action] = useFormState(createServiceCategory, getInitialFormState());
  useEffect(() => { if (state.ok) { router.refresh(); onSuccess?.(); } }, [state.ok, router, onSuccess]);
  return <form action={action} className="space-y-5"><div className="space-y-2"><Label htmlFor="service-category-name">Nome da categoria</Label><Input id="service-category-name" name="name" placeholder="Ex.: Serviços para igrejas" required /></div><div className="space-y-2"><Label htmlFor="service-category-description">Descrição <span className="font-normal text-[var(--color-text-subtle)]">(opcional)</span></Label><Textarea id="service-category-description" name="description" maxLength={160} placeholder="Ajuda interna para a equipe." /></div><div className="space-y-3"><CategorySubmit />{state.message && <p className={`text-sm ${state.ok ? "text-[var(--color-wine)]" : "text-red-700"}`} role="status">{state.message}</p>}</div></form>;
}

function CategorySubmit() { const { pending } = useFormStatus(); return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Salvando..." : "Salvar categoria"}</Button>; }
