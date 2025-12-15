"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-[#e6dad2] bg-white px-4 text-sm text-[#3f2b22] placeholder:text-[#9c7d6c] shadow-[0_8px_25px_rgba(63,33,25,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1b4aa] disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
