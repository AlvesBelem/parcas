import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variant === "default" &&
          "border-[#e8d3ad] bg-[#fbf5eb] text-[var(--color-wine)]",
        variant === "outline" &&
          "border-[var(--color-border-strong)] text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}
