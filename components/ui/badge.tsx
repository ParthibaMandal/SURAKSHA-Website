import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#06B6D4] select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-[#06B6D4]/15 text-[#38BDF8] border-[#06B6D4]/35",
        secondary:
          "bg-white/5 text-slate-300 border-white/10",
        destructive:
          "bg-[#EF4444]/18 text-[#F87171] border-[#EF4444]/40",
        warning:
          "bg-[#F59E0B]/18 text-[#FBBF24] border-[#F59E0B]/40",
        outline: "text-slate-400 border-white/15",
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
