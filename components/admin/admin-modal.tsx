"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminModalProps = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function AdminModal({
  title,
  description,
  open,
  onClose,
  children,
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-3xl space-y-4 rounded-3xl border border-[#b02a20]/15 bg-white p-6 text-[#2d1c16] shadow-[0_24px_80px_rgba(45,28,22,0.15)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">{title}</h3>
            {description && <p className="text-sm text-neutral-600">{description}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#b02a20]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
      </div>
    </div>
  );
}
