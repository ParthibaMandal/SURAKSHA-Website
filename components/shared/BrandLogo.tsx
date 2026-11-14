import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", size = "md" }) => {
  const markDimensions =
    size === "sm" ? "w-8 h-8 rounded-lg" : size === "lg" ? "w-11 h-11 rounded-xl" : "w-9 h-9 rounded-xl";
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Brand Mark Tile */}
      <span
        className={`${markDimensions} border border-teal-400/40 grid place-items-center bg-gradient-to-br from-[#163638] to-[#0e1d21] shadow-[0_0_20px_rgba(94,234,212,0.25)] group-hover:border-[#5eead4] group-hover:shadow-[0_0_30px_rgba(94,234,212,0.5)] group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.8"
          className={iconSize}
        >
          <path
            d="M3 8c3-2 5-2 8 0s5 2 10 0M3 13c3-2 5-2 8 0s5 2 10 0M3 18c3-2 5-2 8 0s5 2 10 0"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-[0.12em] text-[#f0f7f6] ${titleSize} leading-tight`}>
          SURAKSHA
        </span>
        <small className="text-[8px] font-bold text-[#627b77] tracking-[0.2em] uppercase -mt-0.5 block">
          FLOOD INTELLIGENCE
        </small>
      </div>
    </Link>
  );
};

