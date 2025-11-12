"use client";

import { useFormState, useFormStatus } from "react-dom";

import { createProductCategory } from "@/lib/actions/product-category-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState = getInitialFormState();

export function ProductCategoryForm() {
  const [state, formAction] = useFormState(createProductCategory, initialState);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          Categorias de produtos
        </p>
        <h2 className="text-2xl font-semibold text-white">Cadastrar categoria</h2>
        <p className="text-sm text-white/70">
          Use nomes claros para identificar os produtos de Hotmart, Kiwify, Amazon etc.
        </p>
      </div>

      <Field label="Nome da categoria" name="name">
        <Input
          name="name"
          id="product-category-name"
          placeholder="Cursos, Livros, Tecnologia..."
          required
          autoComplete="off"
        />
      </Field>

      <Field label="Descricao interna" name="description" optional>
        <Textarea
          name="description"
          id="product-category-description"
          placeholder="Ajuda os admins a entender o objetivo desta categoria."
          maxLength={160}
        />
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
      {pending ? "Salvando..." : "Salvar categoria"}
    </Button>
  );
}
