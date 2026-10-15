"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Power, Trash2, X } from "lucide-react";

import type { PartnerProductSummary } from "@/lib/data/products";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductGridProps = {
  products: PartnerProductSummary[];
  onEdit: (product: PartnerProductSummary) => void;
};

export function ProductGrid({ products, onEdit }: ProductGridProps) {
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (!products.length) return <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-9 text-center text-sm leading-6 text-[var(--color-text-muted)]">Ainda não há produtos cadastrados.</div>;

  return (
    <>
      <section className="border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="products-list-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wine)]">Registros</p>
            <h2 id="products-list-title" className="mt-1 font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-text)]">Produtos cadastrados</h2>
          </div>
          <Badge variant="outline">{products.length} itens</Badge>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {products.map((product) => {
            const coverImage = product.imageUrls[0] ?? "/logo_cpad_belem.svg";
            return (
              <article key={product.id} className="grid gap-4 p-5 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
                <button type="button" className="relative h-16 w-16 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2 transition hover:border-[var(--color-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" onClick={() => setPreview({ src: coverImage, alt: product.name })} aria-label={`Ampliar imagem de ${product.name}`}>
                  <Image src={coverImage} alt={product.name} fill className="object-contain p-2" sizes="64px" unoptimized />
                </button>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl leading-tight text-[var(--color-text)]">{product.name}</h3>
                    <Badge>{product.platform}</Badge>
                    <Badge variant="outline">{product.category?.name ?? "Sem categoria"}</Badge>
                    <Badge variant="outline">{product.active ? "Ativo" : "Pausado"}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">{product.description ?? "Sem descrição cadastrada."}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-subtle)]"><span>Cadastrado em {formatDate(product.createdAt)}</span><span>{product.clickCount} cliques externos registrados</span></div>
                </div>
                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(product)}><Pencil className="h-3.5 w-3.5" aria-hidden /> Editar</Button>
                  <form action={toggleProductStatus}><input type="hidden" name="productId" value={product.id} /><input type="hidden" name="nextStatus" value={(!product.active).toString()} /><Button type="submit" variant="ghost" size="sm" className="border border-[var(--color-border)]"><Power className="h-3.5 w-3.5" aria-hidden /> {product.active ? "Pausar" : "Ativar"}</Button></form>
                  <form action={deleteProduct}><input type="hidden" name="productId" value={product.id} /><Button type="submit" variant="ghost" size="icon" className="border border-[var(--color-border)] text-[var(--color-wine)] hover:bg-red-50" aria-label={`Excluir ${product.name}`} onClick={(event) => { if (!confirm(`Deseja excluir o produto “${product.name}”? Essa ação não pode ser desfeita.`)) event.preventDefault(); }}><Trash2 className="h-4 w-4" aria-hidden /></Button></form>
                  <Link href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center gap-1.5 border border-[var(--color-wine)] px-3 text-xs font-bold text-[var(--color-wine)] transition hover:bg-[var(--color-wine)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">Abrir <ExternalLink className="h-3.5 w-3.5" aria-hidden /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {preview && <ImagePreview preview={preview} onClose={() => setPreview(null)} />}
    </>
  );
}

function ImagePreview({ preview, onClose }: { preview: { src: string; alt: string }; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Visualizando ${preview.alt}`} onClick={onClose}>
    <div className="relative w-full max-w-4xl border border-white/20 bg-white p-3 shadow-[var(--shadow-raised)]" onClick={(event) => event.stopPropagation()}>
      <button type="button" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center bg-[var(--color-wine)] text-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={onClose} aria-label="Fechar visualização"><X className="h-4 w-4" aria-hidden /></button>
      <div className="relative h-[60vh] min-h-72 w-full"><Image src={preview.src} alt={preview.alt} fill sizes="100vw" className="object-contain" unoptimized /></div>
    </div>
  </div>;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}
