import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ExternalLink } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#2e4952]/40 bg-[#070b0e] text-[#9bb2af] text-sm mt-24">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info with exact Logo */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Connecting hydrological signals, geospatial evidence and response-oriented information for flood-risk decision support.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#142329] text-[#c7dbd7] border border-[#2e4952]">
              <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
              Research prototype · Minor project
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/platform" className="hover:text-[#5eead4] transition-colors">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#5eead4] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/study-area" className="hover:text-[#5eead4] transition-colors">
                  Study Area
                </Link>
              </li>
              <li>
                <Link href="/demo-lab" className="hover:text-[#5eead4] transition-colors">
                  Demo Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Research
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/research" className="hover:text-[#5eead4] transition-colors">
                  Validation & NSE Scores
                </Link>
              </li>
              <li>
                <Link href="/alerts-safety" className="hover:text-[#5eead4] transition-colors">
                  Alerts & Safety
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#5eead4] transition-colors">
                  Collaborate
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/shouri123/SURAKSHA"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-[#5eead4] transition-colors"
                >
                  Scientific Backend Repo <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Application */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/auth/login" className="hover:text-[#5eead4] transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-[#5eead4] transition-colors">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-[#5eead4] transition-colors">
                  Citizen preview
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#5eead4] transition-colors">
                  Operations preview
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-14 pt-6 border-t border-[#1c2e35] flex flex-col sm:flex-row items-center justify-between text-xs text-[#627b77] gap-4">
          <span>© 2026 SURAKSHA · Flood intelligence research project</span>
          <span className="text-center sm:text-right">
            Not an official emergency or government alert service.
          </span>
        </div>
      </div>
    </footer>
  );
};
