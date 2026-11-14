"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ExternalLink } from "lucide-react";

export const PublicFooter: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/horizon")) {
    return null;
  }
  return (
    <footer className="border-t border-[#1c2c34] bg-[#03090c] text-[#9bb2af] text-sm mt-20">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Connecting hydrological signals, geospatial evidence and response-oriented information for flood-risk decision support.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs text-[#9bb2af] border border-[#1c2c34] bg-[#071115]">
              Research prototype, academic evaluation
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/platform" className="hover:text-[#08a2be] transition-colors">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#08a2be] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/study-area" className="hover:text-[#08a2be] transition-colors">
                  Study Area
                </Link>
              </li>
              <li>
                <Link href="/demo-lab" className="hover:text-[#08a2be] transition-colors">
                  Demo Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Research
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/research" className="hover:text-[#08a2be] transition-colors">
                  Validation and NSE Scores
                </Link>
              </li>
              <li>
                <Link href="/alerts-safety" className="hover:text-[#08a2be] transition-colors">
                  Alerts and Safety
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#08a2be] transition-colors">
                  Collaborate
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/shouri123/SURAKSHA"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#9bb2af] hover:text-[#08a2be] transition-colors"
                >
                  Scientific Backend Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Application */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citizen" className="hover:text-[#08a2be] transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#08a2be] transition-colors">
                  Operations Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#1c2c34] flex flex-col sm:flex-row items-center justify-between text-xs text-[#627b77] gap-4">
          <span>© 2026 SURAKSHA, flood intelligence research prototype.</span>
          <span className="text-center sm:text-right">
            Not an official emergency or government warning service.
          </span>
        </div>
      </div>
    </footer>
  );
};
