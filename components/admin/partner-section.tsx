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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Vitrine oficial
          </p>
          <h2 className="text-2xl font-semibold text-white">Parceiros cadastrados</h2>
          <p className="text-sm text-white/60">
            Cadastre novas lojas homologadas. Edite, pause ou exclua sempre que precisar.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          Cadastrar parceiro
        </Button>
      </div>

      <PartnerGrid partners={partners} onEdit={setEditingPartner} />

      <div className="sticky bottom-4 z-10 lg:hidden">
        <div className="rounded-full border border-white/10 bg-black/70 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur">
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
