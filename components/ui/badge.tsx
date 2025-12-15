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
          "border-[#f3cfc6] bg-[#fdf0ec] text-[#9e231d]",
        variant === "outline" &&
          "border-[#e1d4ca] text-[#6d4c3d]",
        className,
      )}
      {...props}
    />
  );
}
