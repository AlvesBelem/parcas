import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b02a20]/60 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[#b02a20] text-white shadow-sm shadow-[#8c1f18]/20 hover:bg-[#9a231a] focus-visible:ring-[#e8b770]",
        secondary:
          "border border-[#b02a20]/25 bg-white text-[#b02a20] hover:border-[#b02a20]/60 hover:bg-[#fff4ee]",
        ghost: "text-[#b02a20] hover:text-[#7d1a14] hover:bg-[#fff4ee] border border-transparent",
        danger:
          "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-200",
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
