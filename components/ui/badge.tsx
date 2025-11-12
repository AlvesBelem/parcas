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
          "border-lime-300/30 bg-lime-300/20 text-lime-200",
        variant === "outline" &&
          "border-white/30 text-white/70",
        className,
      )}
      {...props}
    />
  );
}
