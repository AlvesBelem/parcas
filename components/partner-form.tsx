"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createPartner } from "@/lib/actions/partner-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { CategoryOption } from "@/lib/data/categories";
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

type PartnerFormProps = {
  categories: CategoryOption[];
};

export function PartnerForm({ categories }: PartnerFormProps) {
  const [state, formAction] = useFormState(createPartner, initialState);
  const [selectedCategory, setSelectedCategory] = useState("");
  const hasCategories = categories.length > 0;

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-[#b02a20]/15 bg-white p-8 shadow-[0_18px_60px_rgba(45,28,22,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">Cadastro rápido</p>
        <h2 className="text-2xl font-semibold text-[#2d1c16]">Cadastrar parceiro</h2>
        <p className="text-sm text-neutral-600">
          Todas as informações aparecem automaticamente na home após a aprovação.
        </p>
      </div>

      {!hasCategories ? (
        <div className="rounded-2xl border border-dashed border-[#b02a20]/25 bg-[#fff7f2] p-6 text-sm text-neutral-700">
          Cadastre pelo menos uma categoria antes de publicar parceiros. Elas são exibidas no select e
          no filtro público.
        </div>
      ) : (
        <>
          <Field label="Nome da loja" name="name">
            <Input
              name="name"
              id="name"
              placeholder="Ex: Boutique Aurora"
              required
              autoComplete="off"
            />
          </Field>

          <Field label="Categoria" name="categoryId">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            <input type="hidden" name="categoryId" value={selectedCategory} required />
          </Field>

          <Field label="Link oficial" name="url">
            <Input
              name="url"
              id="url"
              type="url"
              inputMode="url"
              placeholder="https://parceiro.com.br"
              required
              autoComplete="off"
            />
          </Field>

          <Field
            label="Foto ou logo"
            name="logoUrl"
            hint="Aceita um link HTTPS ou um caminho como /parceiros/loja-x/logo.png dentro da pasta public."
          >
            <Input
              name="logoUrl"
              id="logoUrl"
              placeholder="https://cdn.parceiro.com/logo.png ou /parceiros/loja-x/logo.png"
              required
              autoComplete="off"
            />
          </Field>

          <Field label="Descrição curta" name="description" optional>
            <Textarea
              name="description"
              id="description"
              placeholder="Conte em poucas palavras o benefício dessa parceria."
              maxLength={240}
            />
          </Field>
        </>
      )}

      <div className="flex flex-col gap-3">
        <SubmitButton disabled={!hasCategories} />
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`} role="status">
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
      <Label htmlFor={name} className="text-[#2d1c16]">
        {label} {optional && <span className="text-xs uppercase text-neutral-500">Opcional</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? "Salvando..." : "Salvar parceiro"}
    </Button>
  );
}
