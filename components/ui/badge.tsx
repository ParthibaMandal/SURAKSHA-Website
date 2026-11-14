import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#08a2be]/30 bg-[#08a2be]/10 text-[#08a2be]",
        secondary:
          "border-[#1c2c34] bg-[#0f1d24] text-[#9bb2af]",
        destructive:
          "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#fca5a5]",
        warning:
          "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fef08a]",
        outline: "border-[#1c2c34] text-[#9bb2af]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

