import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#2F6BFF]/15 text-[#2F6BFF] border-[#2F6BFF]/35",
        secondary:
          "bg-[#33332E] text-[#D8CBB3] border-[#D8CBB3]/18",
        destructive:
          "bg-[#EF4444]/18 text-[#F87171] border-[#EF4444]/40",
        warning:
          "bg-[#F59E0B]/18 text-[#FBBF24] border-[#F59E0B]/40",
        outline: "text-[#A69B88] border-[#D8CBB3]/20",
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
