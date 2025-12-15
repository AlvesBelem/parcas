"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import type { AdminCategoryEntry } from "@/lib/data/categories";
import { updateCategory } from "@/lib/actions/category-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = getInitialFormState();

export function CategoryEditForm({
  category,
  onSuccess,
}: {
  category: AdminCategoryEntry;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateCategory, initialState);
  const [scope, setScope] = useState(category.scope);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    startTransition(() => {
      setScope(category.scope);
    });
    router.refresh();
    onSuccess?.();
  }, [state.ok, router, onSuccess, category.scope]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-3xl border border-[#eaded5] bg-[#fff8f3] p-8"
    >
      <input type="hidden" name="id" value={category.id} />
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-[#b02b24]">Edição rápida</p>
        <h2 className="text-2xl font-semibold text-[#2f1d15]">Editar categoria</h2>
        <p className="text-sm text-[#7a5a4b]">
          Atualize nome, descrição e tipo sem sair do painel.
        </p>
      </div>

      <Field label="Nome da categoria" name="name">
        <Input
          name="name"
          id="name"
          defaultValue={category.name}
          placeholder="Moda Feminina, Games, Tecnologia..."
          required
          autoComplete="off"
        />
      </Field>

      <Field label="Descrição interna" name="description" optional>
        <Textarea
          name="description"
          id="description"
          defaultValue={category.description ?? ""}
          placeholder="Texto curto que ajuda os admins a lembrarem o foco desta categoria."
          maxLength={160}
        />
      </Field>

      <Field label="Tipo da categoria" name="scope">
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="partners">Parcerias da vitrine</SelectItem>
            <SelectItem value="products">Produtos afiliados</SelectItem>
            <SelectItem value="both">Ambos (lojas e produtos)</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="scope" value={scope} />
      </Field>

      <div className="flex flex-col gap-3">
        <SubmitButton />
        {(state.message || state.ok) && (
          <p className={`text-sm ${state.ok ? "text-[#b02b24]" : "text-[#d53838]"}`} role="status">
            {state.message || "Categoria atualizada com sucesso!"}
          </p>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  optional?: boolean;
  children: React.ReactNode;
};

function Field({ label, name, optional, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {optional && <span className="text-xs uppercase text-[#a38271]">Opcional</span>}
      </Label>
      {children}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}
