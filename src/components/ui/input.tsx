import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] px-5 text-base text-[#3A3024] outline-none placeholder:text-[#9A9184] focus:border-[#B8955A] focus:ring-2 focus:ring-[#B8955A]/20 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          type === "date" && "[color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
