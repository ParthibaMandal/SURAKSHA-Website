import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow-sm hover:bg-neutral-100 active:scale-[0.99]",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-red-500 active:scale-[0.99]",
        outline:
          "border border-white/15 bg-white/5 text-white shadow-sm hover:bg-white/10 hover:border-white/30",
        secondary:
          "bg-[#0A0A0A] text-white border border-white/10 shadow-sm hover:bg-[#141414]",
        ghost:
          "hover:bg-white/5 text-zinc-300 hover:text-white",
        link:
          "text-white underline-offset-4 hover:underline",
        subtle:
          "bg-white/10 text-white border border-white/20 hover:bg-white/15",
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
