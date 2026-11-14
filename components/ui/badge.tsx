import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cyan-500/15 text-cyan-glow border border-cyan-500/30",
        secondary:
          "border-transparent bg-suraksha-800 text-slate-300 border border-suraksha-700",
        destructive:
          "border-transparent bg-red-500/20 text-red-300 border border-red-500/40",
        warning:
          "border-transparent bg-amber-500/20 text-amber-300 border border-amber-500/40",
        outline: "text-slate-300 border-slate-700",
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

