import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-lime-400 text-zinc-950 hover:bg-lime-300 focus-visible:ring-lime-200",
        secondary:
          "border border-white/20 bg-transparent text-white hover:border-white/60",
        ghost: "text-white/80 hover:text-white hover:bg-white/10",
        danger:
          "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-200",
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
