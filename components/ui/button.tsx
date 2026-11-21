import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[#090C10] shadow-sm hover:bg-slate-100 active:scale-[0.99]",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-red-500 active:scale-[0.99]",
        outline:
          "border border-white/15 bg-white/5 text-white shadow-sm hover:bg-white/10 hover:border-white/25",
        secondary:
          "bg-[#10161F] text-white border border-white/10 shadow-sm hover:bg-[#16202C]",
        ghost:
          "hover:bg-white/5 text-slate-300 hover:text-white",
        link:
          "text-[#06B6D4] underline-offset-4 hover:underline",
        subtle:
          "bg-[#06B6D4]/14 text-[#38BDF8] border border-[#06B6D4]/30 hover:bg-[#06B6D4]/22",
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
