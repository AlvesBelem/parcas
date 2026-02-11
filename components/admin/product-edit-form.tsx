"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updateProduct } from "@/lib/actions/product-actions";
import { getInitialFormState } from "@/lib/actions/form-action-state";
import type { PartnerProductSummary } from "@/lib/data/products";
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

type ProductEditFormProps = {
  product: PartnerProductSummary;
  categories: ProductCategoryOption[];
  onSuccess?: () => void;
};

const initialState = getInitialFormState();
const MAX_IMAGES = 5;

export function ProductEditForm({ product, categories, onSuccess }: ProductEditFormProps) {
  const updateAction = useMemo(() => updateProduct.bind(null, product.id), [product.id]);
  const [state, formAction] = useFormState(updateAction, initialState);
  const [imageFields, setImageFields] = useState<string[]>(
    product.imageUrls.length ? product.imageUrls : [""],
  );
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    product.category?.id ?? categories[0]?.id ?? "",
  );
  const hasCategories = categories.length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

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

  async function handleUpload(files: FileList) {
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files).slice(0, MAX_IMAGES)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Falha ao enviar imagem");
        }

        const data = (await response.json()) as { url?: string };
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (!uploadedUrls.length) return;

      setImageFields((prev) => {
        const next = [...prev];
        for (const url of uploadedUrls) {
          const emptyIndex = next.findIndex((value) => !value);
          if (emptyIndex !== -1) {
            next[emptyIndex] = url;
          } else if (next.length < MAX_IMAGES) {
            next.push(url);
          }
        }
        return next.slice(0, MAX_IMAGES);
      });
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel enviar a imagem. Verifique o token do Blob e tente novamente.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-[#eaded5] bg-[#fff8f3] p-8 shadow-[0_15px_45px_rgba(63,33,25,0.08)]"
    >
      <Field label="Nome do produto" name="name">
        <Input name="name" defaultValue={product.name} required />
      </Field>
      <Field label="Plataforma" name="platform">
        <Input name="platform" defaultValue={product.platform} required />
      </Field>
      <Field label="Link oficial" name="url">
        <Input name="url" type="url" defaultValue={product.url} required />
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
          <p className="rounded-2xl border border-dashed border-[#eaded5] bg-white p-4 text-sm text-[#7a5a4b]">
            Cadastre uma categoria de produto antes de editar ofertas.
          </p>
        )}
      </Field>

      <div className="space-y-3">
        <Label>
          Imagens
          <span className="ml-2 text-xs uppercase text-[#a38271]">(1 a 5 imagens)</span>
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && handleUpload(event.target.files)}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#7a5a4b]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Upload com Vercel Blob"}
          </Button>
          <span>Envie imagens e preencha as URLs automaticamente.</span>
        </div>
        <div className="space-y-2">
          {imageFields.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                name="imageUrls"
                value={value}
                onChange={(event) => updateImageField(index, event.target.value)}
                required={index === 0}
              />
              {imageFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#b02b24] hover:bg-[#fff1ec]"
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

      <Field label="Descrição" name="description" optional>
        <Textarea
          name="description"
          defaultValue={product.description ?? ""}
          maxLength={3000}
          className="resize-none"
        />
      </Field>
      <div className="flex flex-col gap-3">
        <SubmitButton disabled={!hasCategories || !selectedCategory} />
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-[#b02b24]" : "text-[#d53838]"}`}>{state.message}</p>
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
        {label} {optional && <span className="text-xs uppercase text-[#a38271]">(Opcional)</span>}
      </Label>
      {children}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}
