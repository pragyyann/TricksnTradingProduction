import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "accent-emerald" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          // Variants
          {
            "bg-[#D4B77A] text-[#3A3024] hover:bg-[#B8955A] shadow-sm focus-visible:ring-[#B8955A]":
              variant === "primary" || variant === "accent",
            "border border-[#B8955A] bg-[#FBF9F4] text-[#3A3024] hover:bg-[#EEE7D8] focus-visible:ring-[#B8955A]":
              variant === "secondary",
            "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm focus-visible:ring-[#10B981]":
              variant === "accent-emerald",
            "border border-[#D8CCB8] bg-[#FBF9F4] text-[#3A3024] hover:bg-[#EEE7D8] focus-visible:ring-[#B8955A]":
              variant === "outline",
            "bg-transparent text-[#3A3024] hover:bg-[#EEE7D8] focus-visible:ring-[#B8955A]":
              variant === "ghost",
            "bg-transparent text-[#B8955A] underline-offset-4 hover:text-[#D4B77A] p-0 h-auto":
              variant === "link",
          },
          // Sizes
          {
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-13 px-8 text-lg rounded-2xl": size === "lg",
            "h-11 w-11 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
