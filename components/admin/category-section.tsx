"use client";

import { useState } from "react";

import type { AdminCategoryEntry } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/components/admin/category-list";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryEditForm } from "@/components/admin/category-edit-form";
import { AdminModal } from "@/components/admin/admin-modal";

type CategorySectionProps = {
  categories: AdminCategoryEntry[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategoryEntry | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Base de categorias
          </p>
          <h2 className="text-2xl font-semibold text-white">Gerenciar categorias</h2>
          <p className="text-sm text-white/60">
            Tudo o que voce cadastrar aqui aparece no filtro da landing e no select de parceiros.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Cadastrar categoria</Button>
      </div>

      <CategoryList categories={categories} onEdit={setEditing} />

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title="Cadastrar categoria"
        description="Preencha os campos para criar uma nova categoria."
      >
        <CategoryForm />
      </AdminModal>

      <AdminModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Editar categoria"
        description="Atualize os dados e confirme para salvar."
      >
        {editing && (
          <CategoryEditForm
            key={editing.id}
            category={editing}
            onSuccess={() => setEditing(null)}
          />
        )}
      </AdminModal>
    </section>
  );
}
