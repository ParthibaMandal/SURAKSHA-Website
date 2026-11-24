import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-glass inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A460]/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "btn-glass-primary text-[#F5F5DC]",
        destructive:
          "bg-[#E35336]/30 backdrop-blur-xl border border-[#E35336]/60 text-[#F5F5DC] shadow-[inset_0_1px_0_0_rgba(245,245,220,0.3),0_8px_24px_rgba(227,83,54,0.35)] hover:bg-[#E35336]/45 hover:border-[#F4A460]/80",
        outline: "btn-glass-secondary text-[#F5F5DC]",
        secondary: "btn-glass-secondary text-[#F5F5DC]",
        ghost:
          "bg-[#A0522D]/[0.15] hover:bg-[#E35336]/[0.22] border border-transparent hover:border-[#F4A460]/40 text-[#F5F5DC]/85 hover:text-[#F5F5DC] backdrop-blur-md",
        link: "text-[#F4A460] hover:text-[#F5F5DC] underline-offset-4 hover:underline bg-transparent backdrop-blur-none",
        subtle: "btn-glass-secondary text-[#F5F5DC]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-full px-3.5 text-xs",
        lg: "h-11 rounded-full px-7 text-sm",
        icon: "h-9 w-9 rounded-full",
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
