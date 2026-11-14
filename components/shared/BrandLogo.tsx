import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", size = "md" }) => {
  const iconSize = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6";
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Crisp Brand Mark without tile or colored glow */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#08a2be"
        strokeWidth="2"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M3 8c3-2 5-2 8 0s5 2 10 0M3 13c3-2 5-2 8 0s5 2 10 0M3 18c3-2 5-2 8 0s5 2 10 0"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-bold tracking-wider text-[#f0f7f6] ${titleSize} leading-tight`}>
          SURAKSHA
        </span>
        <span className="text-[9px] font-semibold text-[#9bb2af] tracking-widest uppercase block">
          Flood Intelligence
        </span>
      </div>
    </Link>
  );
};
