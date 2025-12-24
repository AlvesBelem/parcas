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
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variant === "default" &&
          "border-[#b02a20]/30 bg-[#fff4ee] text-[#9a231a]",
        variant === "outline" &&
          "border-[#b02a20]/40 text-[#b02a20]",
        className,
      )}
      {...props}
    />
  );
}
