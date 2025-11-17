"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createProduct } from "@/lib/actions/product-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { ProductCategoryOption } from "@/lib/data/product-categories";
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
const MAX_IMAGES = 5;

type ProductFormProps = {
  categories: ProductCategoryOption[];
};

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(createProduct, initialState);
  const [imageFields, setImageFields] = useState<string[]>([""]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const hasCategories = categories.length > 0;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    startTransition(() => {
      setImageFields([""]);
      setSelectedCategory(categories[0]?.id ?? "");
    });
    router.refresh();
  }, [state.ok, categories, router]);

  function updateImageField(index: number, value: string) {
    setImageFields((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  }

  function addImageField() {
    setImageFields((prev) => {
      if (prev.length >= MAX_IMAGES) return prev;
      return [...prev, ""];
    });
  }

  function removeImageField(index: number) {
    setImageFields((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <Field label="Nome do produto" name="name">
        <Input name="name" id="product-name" placeholder="Curso XYZ" required autoComplete="off" />
      </Field>

      <Field label="Plataforma" name="platform">
        <Input
          name="platform"
          id="platform"
          placeholder="Hotmart, Kiwify, Amazon..."
          required
          autoComplete="off"
        />
      </Field>

      <Field label="Link oficial" name="url">
        <Input
          name="url"
          id="product-url"
          type="url"
          placeholder="https://hotmart.com/produto"
          required
        />
      </Field>
      <Field label="Categoria" name="categoryId">
        {hasCategories ? (
          <>
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
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-4 text-sm text-white/70">
            Cadastre uma categoria de produto antes de publicar ofertas.
          </p>
        )}
      </Field>

      <div className="space-y-3">
        <Label>
          Imagens
          <span className="ml-2 text-xs uppercase text-white/40">(1 a 5 imagens)</span>
        </Label>
        <div className="space-y-2">
          {imageFields.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                name="imageUrls"
                value={value}
                onChange={(event) => updateImageField(index, event.target.value)}
                placeholder="https://cdn.com/produto.png ou /produtos/meu-produto/cover.png"
                required={index === 0}
              />
              {imageFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImageField(index)}
                >
                  Remover
                </Button>
              )}
            </div>
          ))}
        </div>
        {imageFields.length < MAX_IMAGES && (
          <Button type="button" variant="secondary" size="sm" onClick={addImageField}>
            Adicionar imagem
          </Button>
        )}
      </div>

      <Field label="Descricao" name="description" optional>
        <Textarea
          name="description"
          id="product-description"
          placeholder="Resumo curto destacando beneficios."
          maxLength={3000}
          className="resize-none"
        />
      </Field>

      <div className="flex flex-col gap-3">
        <SubmitButton disabled={!hasCategories || !selectedCategory} />
        {(state.message || state.ok === true) && (
          <p className={`text-sm ${state.ok ? "text-lime-300" : "text-red-300"}`}>
            {state.message || "Produto cadastrado com sucesso!"}
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
};

function Field({ label, name, children, optional }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {optional && <span className="text-xs uppercase text-white/40">(Opcional)</span>}
      </Label>
      {children}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? "Salvando..." : "Salvar produto"}
    </Button>
  );
}
