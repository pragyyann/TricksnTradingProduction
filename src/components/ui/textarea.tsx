import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[110px] w-full rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] px-5 py-4 text-base text-[#3A3024] outline-none placeholder:text-[#9A9184] focus:border-[#B8955A] focus:ring-2 focus:ring-[#B8955A]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
