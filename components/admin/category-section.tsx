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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#b02a20]/15 bg-white/80 p-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Base de categorias</p>
          <h2 className="text-2xl font-semibold text-[#2d1c16]">Gerenciar categorias</h2>
          <p className="text-sm text-neutral-600">
            Tudo o que você cadastrar aqui aparece no filtro da landing e no select de parceiros.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          Cadastrar categoria
        </Button>
      </div>

      <CategoryList categories={categories} onEdit={setEditing} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <div className="rounded-full border border-[#b02a20]/15 bg-white px-4 py-3 shadow-[0_16px_50px_rgba(45,28,22,0.08)] backdrop-blur">
          <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
            + Cadastrar categoria
          </Button>
        </div>
      </div>

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
