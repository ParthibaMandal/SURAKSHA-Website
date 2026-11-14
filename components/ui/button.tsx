import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500 text-suraksha-950 font-semibold shadow hover:bg-cyan-400 active:scale-[0.98]",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-[0.98]",
        outline:
          "border border-suraksha-700 bg-suraksha-900/60 text-slate-200 shadow-sm hover:bg-suraksha-800 hover:border-cyan-500/40 hover:text-white",
        secondary:
          "bg-suraksha-800 text-slate-200 shadow-sm hover:bg-suraksha-700 hover:text-white",
        ghost: "hover:bg-suraksha-800/60 text-slate-300 hover:text-white",
        link: "text-cyan-400 underline-offset-4 hover:underline",
        subtle:
          "bg-cyan-500/10 text-cyan-glow border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
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

