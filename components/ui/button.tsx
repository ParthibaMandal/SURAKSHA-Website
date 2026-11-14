import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#08a2be] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#08a2be] text-[#03090c] font-semibold hover:bg-[#0bb6d5]",
        destructive:
          "bg-red-600 text-white hover:bg-red-500",
        outline:
          "border border-[#1c2c34] bg-[#071115] text-[#f0f7f6] hover:bg-[#0f1d24] hover:border-[#08a2be]/60",
        secondary:
          "bg-[#0f1d24] text-[#c7dbd7] border border-[#1c2c34] hover:bg-[#172a33] hover:text-[#f0f7f6]",
        ghost: "hover:bg-[#0f1d24] text-[#9bb2af] hover:text-[#f0f7f6]",
        link: "text-[#08a2be] underline-offset-4 hover:underline",
        subtle:
          "bg-[#08a2be]/10 text-[#08a2be] border border-[#08a2be]/30 hover:bg-[#08a2be]/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-10 rounded px-5 text-sm",
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

