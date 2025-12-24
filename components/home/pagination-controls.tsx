import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/styles/button";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function PaginationControls({ page, totalPages, buildHref }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pagesToRender = createPageList(page, totalPages);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={buildHref(Math.max(page - 1, 1))}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "gap-1",
          page === 1 && "pointer-events-none opacity-50",
        )}
        aria-disabled={page === 1}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Anterior
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {pagesToRender.map((item, index) =>
          typeof item === "number" ? (
            <Link
              key={item}
              href={buildHref(item)}
              className={cn(
                "h-9 w-9 rounded-full border border-black/10 text-center text-sm leading-9 text-neutral-700 transition",
                item === page && "border-[#b02a20]/60 bg-[#fff0e6] text-[#b02a20] font-semibold",
              )}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ) : (
            <span key={`ellipsis-${index}`} className="px-1 text-neutral-500">
              &hellip;
            </span>
          ),
        )}
      </div>

      <Link
        href={buildHref(Math.min(page + 1, totalPages))}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "gap-1",
          page === totalPages && "pointer-events-none opacity-50",
        )}
        aria-disabled={page === totalPages}
      >
        Próxima
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function createPageList(current: number, total: number) {
  const pages: Array<number | string> = [];
  const delta = 2;
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  pages.push(1);
  if (start > 2) {
    pages.push("ellipsis-left");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("ellipsis-right");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}
