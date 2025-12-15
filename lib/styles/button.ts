import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f2a69b] disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[#b22d26] text-white shadow-[0_10px_30px_rgba(178,45,38,0.3)] hover:bg-[#9f241f]",
        secondary:
          "border border-[#e6dad2] bg-white text-[#5b3628] hover:border-[#d7c6bc] hover:bg-[#fff5f1]",
        ghost: "text-[#7b5140] hover:text-[#4d2f26] hover:bg-[#fbe9e2]",
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
