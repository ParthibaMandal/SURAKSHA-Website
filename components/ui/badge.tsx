import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-white/5 text-zinc-200 border-white/15",
        secondary:
          "bg-white/10 text-white border-white/20",
        destructive:
          "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30",
        warning:
          "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
        outline: "text-zinc-400 border-white/10",
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
