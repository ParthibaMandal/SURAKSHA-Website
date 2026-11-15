import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", size = "md" }) => {
  const markDimensions =
    size === "sm" ? "w-8 h-8 rounded-lg" : size === "lg" ? "w-11 h-11 rounded-xl" : "w-9 h-9 rounded-lg";
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Brand Mark */}
      <span
        className={`${markDimensions} border border-[#D8CBB3]/20 grid place-items-center bg-[#292925] group-hover:border-[#2F6BFF] group-hover:bg-[#33332E] transition-colors relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="2"
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
        <span className={`font-extrabold tracking-[0.14em] text-[#D8CBB3] ${titleSize} leading-tight`}>
          SURAKSHA
        </span>
        <small className="text-[8px] font-medium text-[#A69B88] tracking-[0.18em] uppercase -mt-0.5 block">
          Flood Intelligence
        </small>
      </div>
    </Link>
  );
};
