"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

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
  const [state, formAction] = useFormState(createCategory, initialState);
  const [scope, setScope] = useState("partners");

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          Bases do catalogo
        </p>
        <h2 className="text-2xl font-semibold text-white">Cadastrar categoria</h2>
        <p className="text-sm text-white/70">
          Estas categorias podem alimentar o filtro publico de parceiros, produtos afiliados ou ambos.
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

      <Field label="Descricao interna" name="description" optional>
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
        {state.message && (
          <p
            className={`text-sm ${state.ok ? "text-lime-300" : "text-red-300"}`}
            role="status"
          >
            {state.message}
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
      <Label htmlFor={name} className="text-white">
        {label}{" "}
        {optional && <span className="text-xs uppercase text-white/40">Opcional</span>}
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
