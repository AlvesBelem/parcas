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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f1d15]/60 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-3xl space-y-4 rounded-3xl border border-[#eaded5] bg-white p-6 text-[#3f2b22] shadow-[0_22px_65px_rgba(63,33,25,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#2f1d15]">{title}</h3>
            {description && <p className="text-sm text-[#7a5a4b]">{description}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#7a5a4b] hover:bg-[#fff1ec]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
      </div>
    </div>
  );
}
