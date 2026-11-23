import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-glass inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "btn-glass-primary text-white",
        destructive:
          "bg-[#EF4444]/25 backdrop-blur-xl border border-[#EF4444]/45 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_24px_rgba(239,68,68,0.25)] hover:bg-[#EF4444]/35 hover:border-[#EF4444]/70",
        outline: "btn-glass-secondary text-white",
        secondary: "btn-glass-secondary text-white",
        ghost:
          "bg-white/[0.04] hover:bg-white/[0.12] border border-transparent hover:border-white/20 text-zinc-200 hover:text-white backdrop-blur-md",
        link: "text-white underline-offset-4 hover:underline bg-transparent backdrop-blur-none",
        subtle: "btn-glass-secondary text-white",
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
