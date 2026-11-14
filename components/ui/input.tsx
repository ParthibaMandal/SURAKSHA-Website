import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#D8CBB3]/18 bg-[#292925] px-3 py-2 text-sm text-[#D8CBB3] placeholder:text-[#7D7465] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]/60 focus-visible:border-[#2F6BFF] disabled:cursor-not-allowed disabled:opacity-50",
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
