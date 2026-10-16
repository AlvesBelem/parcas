"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import type { ServiceCategoryOption, ServiceSummary } from "@/lib/data/services";
import { createService, updateService } from "@/lib/actions/service-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CommonProps = { categories: ServiceCategoryOption[]; onSuccess?: () => void };

export function ServiceForm(props: CommonProps) {
  return <ServiceFields {...props} title="Salvar serviço" action={createService} />;
}

export function ServiceEditForm({ service, ...props }: CommonProps & { service: ServiceSummary }) {
  return <ServiceFields {...props} service={service} title="Salvar alterações" action={updateService.bind(null, service.id)} />;
}

function ServiceFields({ categories, onSuccess, service, title, action }: CommonProps & { service?: ServiceSummary; title: string; action: typeof createService }) {
  const router = useRouter();
  const [state, formAction] = useFormState(action, getInitialFormState());
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? categories[0]?.id ?? "");

  useEffect(() => {
    if (!state.ok) return;
    router.refresh();
    onSuccess?.();
  }, [state.ok, router, onSuccess]);

  const hasCategories = categories.length > 0;
  return (
    <form action={formAction} className="space-y-6">
      <Field label="Nome do serviço" name="name"><Input id="service-name" name="name" defaultValue={service?.name} placeholder="Ex.: Consultoria contábil" required /></Field>
      <Field label="Categoria" name="categoryId">
        {hasCategories ? <><Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select><input type="hidden" name="categoryId" value={categoryId} /></> : <p className="border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">Cadastre uma categoria de serviço antes de publicar o primeiro serviço.</p>}
      </Field>
      <Field label="Canal oficial" name="url"><Input id="service-url" name="url" type="url" defaultValue={service?.url} placeholder="https://empresa.com/contato" required /></Field>
      <Field label="WhatsApp" name="whatsappNumber" optional><Input id="service-whatsapp" name="whatsappNumber" type="tel" inputMode="tel" autoComplete="tel" defaultValue={service?.whatsappNumber ?? ""} placeholder="5591999999999" /><p className="text-xs text-[var(--color-text-subtle)]">Informe DDI e DDD para exibir o botão de WhatsApp.</p></Field>
      <Field label="Imagem (opcional)" name="imageUrl"><Input id="service-image" name="imageUrl" defaultValue={service?.imageUrl ?? ""} placeholder="https://cdn.com/imagem.png ou /servicos/imagem.png" /></Field>
      <Field label="Texto do botão" name="ctaLabel"><Input id="service-cta" name="ctaLabel" defaultValue={service?.ctaLabel ?? "Conhecer serviço"} maxLength={80} /></Field>
      <Field label="Descrição" name="description" optional><Textarea id="service-description" name="description" defaultValue={service?.description ?? ""} maxLength={3000} placeholder="Explique em poucas palavras o que este serviço oferece." /></Field>
      <div className="space-y-3"><SubmitButton disabled={!hasCategories} label={title} />{state.message && <p className={`text-sm ${state.ok ? "text-[var(--color-wine)]" : "text-red-700"}`} role="status">{state.message}</p>}</div>
    </form>
  );
}

function Field({ label, name, optional, children }: { label: string; name: string; optional?: boolean; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}{optional && <span className="ml-2 text-xs font-normal text-[var(--color-text-subtle)]">Opcional</span>}</Label>{children}</div>;
}

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending || disabled}>{pending ? "Salvando..." : label}</Button>;
}
