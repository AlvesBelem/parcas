"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updatePartner } from "@/lib/actions/partner-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { CategoryOption } from "@/lib/data/categories";
import type { PartnerSummary } from "@/lib/data/partners";
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

type PartnerEditFormProps = {
  partner: PartnerSummary;
  categories: CategoryOption[];
  onSuccess?: () => void;
};

const initialState = getInitialFormState();

export function PartnerEditForm({
  partner,
  categories,
  onSuccess,
}: PartnerEditFormProps) {
  const updateAction = useMemo(() => updatePartner.bind(null, partner.id), [partner.id]);
  const [state, formAction] = useFormState(updateAction, initialState);

  const initialCategory = useMemo(() => {
    return categories.find((category) => category.name === partner.category)?.id ?? "";
  }, [categories, partner.category]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (state.ok) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  const hasCategories = categories.length > 0;

  return (
    <form action={formAction} className="space-y-6">
      <Field label="Nome da loja" name="name">
        <Input
          name="name"
          id="edit-name"
          defaultValue={partner.name}
          required
          autoComplete="off"
        />
      </Field>

      <Field label="Categoria" name="categoryId">
        {hasCategories ? (
          <>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="categoryId"
              value={selectedCategory}
              required
            />
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/70">
            Cadastre uma categoria antes de editar parceiros.
          </p>
        )}
      </Field>

      <Field label="Link oficial" name="url">
        <Input
          name="url"
          id="edit-url"
          type="url"
          defaultValue={partner.url}
          required
        />
      </Field>

      <Field
        label="Foto ou logo"
        name="logoUrl"
        hint="Use um link HTTPS ou um caminho como /parceiros/loja-x/logo.png dentro de public."
      >
        <Input
          name="logoUrl"
          id="edit-logoUrl"
          defaultValue={partner.logoUrl}
          required
        />
      </Field>

      <Field label="Descricao curta" name="description" optional>
        <Textarea
          name="description"
          id="edit-description"
          defaultValue={partner.description ?? ""}
          maxLength={240}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <SubmitButton disabled={!hasCategories || !selectedCategory} />
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
  children: React.ReactNode;
  optional?: boolean;
  hint?: string;
};

function Field({ label, name, children, optional, hint }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-white">
        {label}{" "}
        {optional && <span className="text-xs uppercase text-white/40">Opcional</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-white/50">{hint}</p>}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? "Salvando..." : "Salvar alteracoes"}
    </Button>
  );
}
