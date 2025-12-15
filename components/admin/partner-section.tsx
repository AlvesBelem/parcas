"use client";

import { useState } from "react";

import type { PartnerSummary } from "@/lib/data/partners";
import type { CategoryOption } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { PartnerGrid } from "@/components/admin/partner-grid";
import { PartnerForm } from "@/components/partner-form";
import { AdminModal } from "@/components/admin/admin-modal";
import { PartnerEditForm } from "@/components/admin/partner-edit-form";

type PartnerSectionProps = {
  partners: PartnerSummary[];
  categories: CategoryOption[];
};

export function PartnerSection({ partners, categories }: PartnerSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerSummary | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#eaded5] bg-white p-5 shadow-[0_15px_45px_rgba(63,33,25,0.08)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#b02b24]">Vitrine oficial</p>
          <h2 className="text-2xl font-semibold text-[#2f1d15]">Parceiros cadastrados</h2>
          <p className="text-sm text-[#7a5a4b]">
            Cadastre novas lojas homologadas. Edite, pause ou exclua sempre que precisar.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          Cadastrar parceiro
        </Button>
      </div>

      <PartnerGrid partners={partners} onEdit={setEditingPartner} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <div className="rounded-full border border-[#eaded5] bg-white px-4 py-3 shadow-[0_18px_55px_rgba(63,33,25,0.12)] backdrop-blur">
          <Button className="w-full" size="lg" onClick={() => setCreateOpen(true)}>
            + Cadastrar parceiro
          </Button>
        </div>
      </div>

      <AdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Cadastrar parceiro"
        description="Preencha com os dados oficiais enviados pela equipe da loja."
      >
        <PartnerForm categories={categories} />
      </AdminModal>

      <AdminModal
        open={Boolean(editingPartner)}
        onClose={() => setEditingPartner(null)}
        title="Editar parceiro"
        description="Atualize os dados de exibição e confirme para salvar."
      >
        {editingPartner && (
          <PartnerEditForm
            key={editingPartner.id}
            partner={editingPartner}
            categories={categories}
            onSuccess={() => setEditingPartner(null)}
          />
        )}
      </AdminModal>
    </section>
  );
}
