import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#10B981] text-black font-semibold hover:bg-[#0EA271] border border-transparent",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626] border border-transparent",
        outline:
          "border border-[#1F2823] bg-[#0D100E] text-white hover:border-[#10B981]/50 hover:bg-[#141816]",
        secondary:
          "border border-[#1F2823] bg-[#141816] text-[#9BA5A0] hover:text-white hover:border-[#10B981]/40",
        ghost:
          "text-[#9BA5A0] hover:text-white hover:bg-[#141816] border border-transparent",
        link:
          "text-[#10B981] underline-offset-4 hover:underline bg-transparent",
        subtle:
          "border border-[#1F2823] bg-[#0D100E] text-white hover:bg-[#141816]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-sm",
        icon: "h-9 w-9 rounded-md",
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
