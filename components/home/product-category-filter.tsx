"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductCategoryFilterProps = {
  categories: Array<{ name: string; slug: string }>;
};

export function ProductCategoryFilter({ categories }: ProductCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const currentValue = searchParams.get("productCategory") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("productCategory");
    } else {
      params.set("productCategory", value);
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <Select value={currentValue} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger aria-label="Filtrar produtos por categoria">
        <SelectValue placeholder="Filtrar categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as categorias</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
