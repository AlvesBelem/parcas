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
      className="space-y-6 rounded-3xl border border-white/10 bg-linear-to-b from-zinc-950/80 to-zinc-950/40 p-8 shadow-2xl"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          Cadastro rapido
        </p>
        <h2 className="text-2xl font-semibold text-white">Cadastrar parceiro</h2>
        <p className="text-sm text-white/70">
          Todas as informacoes aparecem automaticamente na home apos a aprovacao.
        </p>
      </div>

      {!hasCategories ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-sm text-white/70">
          Cadastre pelo menos uma categoria antes de publicar parceiros. Elas sao exibidas
          no select e no filtro publico.
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

          <Field label="Descricao curta" name="description" optional>
            <Textarea
              name="description"
              id="description"
              placeholder="Conte em poucas palavras o beneficio dessa parceria."
              maxLength={240}
            />
          </Field>
        </>
      )}

      <div className="flex flex-col gap-3">
        <SubmitButton disabled={!hasCategories} />
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
      {pending ? "Salvando..." : "Salvar parceiro"}
    </Button>
  );
}
