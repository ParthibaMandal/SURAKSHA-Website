import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#2F6BFF] text-white shadow-sm hover:bg-[#4B80FF] active:scale-[0.99]",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-red-500 active:scale-[0.99]",
        outline:
          "border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3] shadow-sm hover:bg-[#33332E] hover:border-[#D8CBB3]/35 hover:text-[#EDE4D3]",
        secondary:
          "bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/15 shadow-sm hover:bg-[#3D3D37] hover:text-[#EDE4D3]",
        ghost:
          "hover:bg-[#292925] text-[#A69B88] hover:text-[#D8CBB3]",
        link:
          "text-[#2F6BFF] underline-offset-4 hover:underline",
        subtle:
          "bg-[#2F6BFF]/14 text-[#2F6BFF] border border-[#2F6BFF]/30 hover:bg-[#2F6BFF]/22",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
