import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-wine)] text-white shadow-[0_10px_24px_rgba(117,11,42,0.22)] hover:bg-[var(--color-wine-dark)]",
        secondary:
          "border border-[var(--color-border-strong)] bg-white text-[var(--color-wine)] hover:border-[var(--color-wine)] hover:bg-[var(--color-surface)]",
        ghost: "text-[var(--color-wine)] hover:bg-[var(--color-surface)] hover:text-[var(--color-wine-dark)]",
        danger:
          "bg-[#e54848] text-white hover:bg-[#d53838] focus-visible:ring-red-200",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);
