"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateCategory } from "@/lib/actions/category-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { CategoryWithStats } from "@/lib/data/categories";
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

type CategoryEditFormProps = {
  category: CategoryWithStats;
  onSuccess?: () => void;
};

export function CategoryEditForm({ category, onSuccess }: CategoryEditFormProps) {
  const initialScope = category.productCategoryId ? "both" : "partners";
  const [scope, setScope] = useState(initialScope);

  const updateAction = useMemo(
    () => updateCategory.bind(null, category.id, category.productCategoryId ?? null),
    [category],
  );

  const [state, formAction] = useFormState(updateAction, initialState);

  useEffect(() => {
    if (state.ok) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
      <Field label="Nome da categoria" name="name">
        <Input name="name" defaultValue={category.name} required autoComplete="off" />
      </Field>

      <Field label="Descricao interna" name="description" optional>
        <Textarea
          name="description"
          defaultValue={category.description ?? ""}
          maxLength={160}
          className="resize-none"
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
          <p className={`text-sm ${state.ok ? "text-lime-300" : "text-red-300"}`} role="status">
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
      {pending ? "Salvando..." : "Salvar alteracoes"}
    </Button>
  );
}
