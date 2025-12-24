"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createCategory } from "@/lib/actions/category-actions";
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

export function CategoryForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createCategory, initialState);
  const [scope, setScope] = useState("partners");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    startTransition(() => {
      setScope("partners");
    });
    router.refresh();
  }, [state.ok, router]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-3xl border border-[#b02a20]/15 bg-white p-8 shadow-[0_18px_60px_rgba(45,28,22,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">Bases do catálogo</p>
        <h2 className="text-2xl font-semibold text-[#2d1c16]">Cadastrar categoria</h2>
        <p className="text-sm text-neutral-600">
          Estas categorias podem alimentar o filtro público de parceiros, produtos afiliados ou ambos.
        </p>
      </div>

      <Field label="Nome da categoria" name="name">
        <Input
          name="name"
          id="name"
          placeholder="Moda Feminina, Games, Tecnologia..."
          required
          autoComplete="off"
        />
      </Field>

      <Field label="Descrição interna" name="description" optional>
        <Textarea
          name="description"
          id="description"
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
          <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`} role="status">
            {state.message || "Categoria cadastrada com sucesso!"}
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
      <Label htmlFor={name} className="text-[#2d1c16]">
        {label} {optional && <span className="text-xs uppercase text-neutral-500">Opcional</span>}
      </Label>
      {children}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Salvando..." : "Salvar categoria"}
    </Button>
  );
}
