"use client";

import { useState } from "react";
import { FolderPlus, Layers } from "lucide-react";

import type { AdminCategoryEntry } from "@/lib/data/categories";
import { AdminModal } from "@/components/admin/admin-modal";
import { CategoryEditForm } from "@/components/admin/category-edit-form";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryList } from "@/components/admin/category-list";
import { Button } from "@/components/ui/button";

type CategorySectionProps = {
  categories: AdminCategoryEntry[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategoryEntry | null>(null);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-wine)]">Taxonomia</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-[var(--color-text)] sm:text-5xl">Categorias</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Mantenha os grupos que aparecem nos filtros e nos formulários de parceiros e produtos.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><FolderPlus className="h-4 w-4" aria-hidden /> Cadastrar categoria</Button>
      </header>

      <div className="grid gap-4 border border-[var(--color-border)] bg-[var(--color-surface-warm)] p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="flex h-11 w-11 items-center justify-center border border-[var(--color-gold)] bg-white text-[var(--color-wine)]"><Layers className="h-5 w-5" aria-hidden /></span>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]"><strong className="font-semibold text-[var(--color-text)]">{categories.length} categorias carregadas.</strong> Alterações aqui podem impactar a navegação e os cadastros existentes.</p>
      </div>

      <CategoryList categories={categories} onEdit={setEditing} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <Button className="w-full shadow-[var(--shadow-raised)]" size="lg" onClick={() => setOpen(true)}><FolderPlus className="h-4 w-4" aria-hidden /> Cadastrar categoria</Button>
      </div>

      <AdminModal open={open} onClose={() => setOpen(false)} title="Cadastrar categoria" description="Use um nome claro para facilitar a busca na vitrine.">
        <CategoryForm />
      </AdminModal>
      <AdminModal open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar categoria" description="Revise a alteração antes de confirmar.">
        {editing && <CategoryEditForm key={editing.id} category={editing} onSuccess={() => setEditing(null)} />}
      </AdminModal>
    </section>
  );
}
