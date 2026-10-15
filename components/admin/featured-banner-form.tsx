"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { CalendarRange, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { removeFeaturedBanner, scheduleFeaturedBanner } from "@/lib/actions/featured-banner-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { FeaturedBannerSchedule } from "@/lib/data/featured-banners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FeaturedBannerTargetInput = {
  targetType: "PARTNER" | "PRODUCT" | "SERVICE";
  targetId: string;
  name: string;
};

export function FeaturedBannerForm({
  target,
  schedule,
  onSuccess,
}: {
  target: FeaturedBannerTargetInput;
  schedule?: FeaturedBannerSchedule;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(scheduleFeaturedBanner, getInitialFormState());
  const [startsAt, setStartsAt] = useState(todayForInput);
  const [endsAt, setEndsAt] = useState(todayForInput);
  const [removing, startRemoving] = useTransition();

  useEffect(() => {
    if (!state.ok) return;
    router.refresh();
    onSuccess();
  }, [state.ok, router, onSuccess]);

  function removeSchedule() {
    if (!schedule) return;
    startRemoving(async () => {
      const formData = new FormData();
      formData.set("bannerId", schedule.id);
      await removeFeaturedBanner(formData);
      router.refresh();
      onSuccess();
    });
  }

  if (schedule) {
    return (
      <div className="space-y-5">
        <div className="border border-[var(--color-gold)] bg-[var(--color-surface-warm)] p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-wine)] text-[var(--color-gold-light)]"><Sparkles className="h-5 w-5" aria-hidden /></span>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{target.name} já está programado no banner.</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">Período: {formatDate(schedule.startsAt)} até {formatDate(schedule.endsAt)}.</p>
            </div>
          </div>
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={removeSchedule} disabled={removing}>
          {removing ? "Removendo programação..." : "Remover do banner"}
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="targetType" value={target.targetType} />
      <input type="hidden" name="targetId" value={target.targetId} />
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{target.name}</span> entrará na rotação automática do banner durante o período informado. Outros itens podem ser programados para o mesmo intervalo.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="featured-starts-at">Data de início</Label>
          <Input id="featured-starts-at" name="startsAt" type="date" value={startsAt} min={todayForInput()} onChange={(event) => setStartsAt(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featured-ends-at">Data de término</Label>
          <Input id="featured-ends-at" name="endsAt" type="date" value={endsAt} min={startsAt || todayForInput()} onChange={(event) => setEndsAt(event.target.value)} required />
        </div>
      </div>
      <p className="flex gap-2 text-xs leading-5 text-[var(--color-text-subtle)]"><CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-wine)]" aria-hidden />O destaque inicia à 00:00 e termina às 23:59 na data selecionada.</p>
      <div className="space-y-3">
        <SubmitButton />
        {state.message ? <p className={`text-sm ${state.ok ? "text-[var(--color-wine)]" : "text-red-700"}`} role="status">{state.message}</p> : null}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full"><Sparkles className="h-4 w-4" aria-hidden />{pending ? "Programando..." : "Adicionar ao banner"}</Button>;
}

function todayForInput() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}
