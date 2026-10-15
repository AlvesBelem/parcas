"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminModalProps = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function AdminModal({ title, description, open, onClose, children }: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-hidden border border-[var(--color-border)] bg-white shadow-[0_28px_70px_rgba(0,0,0,0.3)]" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" aria-describedby={description ? "admin-modal-description" : undefined} onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Administração</p>
            <h2 id="admin-modal-title" className="mt-1 font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-text)]">{title}</h2>
            {description && <p id="admin-modal-description" className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar"><X className="h-4 w-4" aria-hidden /></Button>
        </header>
        <div className="max-h-[calc(100vh-15rem)] overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
      </section>
    </div>
  );
}
