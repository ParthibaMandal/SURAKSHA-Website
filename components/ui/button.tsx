import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-glass inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "btn-glass-primary text-[#F0F9FF]",
        destructive:
          "bg-[#EF4444]/30 backdrop-blur-xl border border-[#EF4444]/60 text-[#F0F9FF] shadow-[inset_0_1px_0_0_rgba(240,249,255,0.3),0_8px_24px_rgba(239,68,68,0.35)] hover:bg-[#EF4444]/45 hover:border-[#EF4444]/80",
        outline: "btn-glass-secondary text-[#F0F9FF]",
        secondary: "btn-glass-secondary text-[#F0F9FF]",
        ghost:
          "bg-[#0284C7]/[0.15] hover:bg-[#0EA5E9]/[0.24] border border-transparent hover:border-[#38BDF8]/40 text-[#F0F9FF]/85 hover:text-[#F0F9FF] backdrop-blur-md",
        link: "text-[#38BDF8] hover:text-[#F0F9FF] underline-offset-4 hover:underline bg-transparent backdrop-blur-none",
        subtle: "btn-glass-secondary text-[#F0F9FF]",
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
