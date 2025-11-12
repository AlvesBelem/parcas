"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryOption } from "@/lib/data/categories";

type CategoryFilterProps = {
  categories: CategoryOption[];
};

type FilterOption = {
  value: string;
  label: string;
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const currentValue = searchParams.get("category") ?? "all";

  const options: FilterOption[] = useMemo(() => {
    return [
      { value: "all", label: "Todas as categorias" },
      ...categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    ];
  }, [categories]);

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <Select value={currentValue} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger aria-label="Filtrar por categoria">
        <SelectValue placeholder="Selecione uma categoria" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
