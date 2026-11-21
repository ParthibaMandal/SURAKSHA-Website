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
    <footer className="border-t border-[#D8CBB3]/15 bg-[#1E1E1C] text-[#A69B88] text-sm mt-20">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Connecting hydrological signals, geospatial evidence, and human-governed response intelligence for flood-risk decision support.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[11px] text-[#D8CBB3] border border-[#D8CBB3]/20 bg-[#292925]">
              Research Prototype, Academic Evaluation
            </div>
          </div>

          {/* Platform & Documentation */}
          <div>
            <h4 className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-3">
              Platform & Documentation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs" className="hover:text-[#2F6BFF] transition-colors font-medium text-[#EDE4D3]">
                  Technical Documentation (84 Docs)
                </Link>
              </li>
              <li>
                <Link href="/docs?doc=09-backend-and-api--api-reference" className="hover:text-[#2F6BFF] transition-colors">
                  REST API Reference
                </Link>
              </li>
              <li>
                <Link href="/platform" className="hover:text-[#2F6BFF] transition-colors">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#2F6BFF] transition-colors">
                  Capabilities & Workflow
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-[#2F6BFF] transition-colors">
                  Hydrological Methodology
                </Link>
              </li>
              <li>
                <Link href="/study-area" className="hover:text-[#2F6BFF] transition-colors">
                  Ganga / Patna Study Area
                </Link>
              </li>
              <li>
                <Link href="/demo-lab" className="hover:text-[#2F6BFF] transition-colors">
                  Simulation Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-3">
              Scientific Research
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/research" className="hover:text-[#2F6BFF] transition-colors">
                  Validation & NSE Metrics
                </Link>
              </li>
              <li>
                <Link href="/alerts-safety" className="hover:text-[#2F6BFF] transition-colors">
                  CAP v1.2 Alerts & Safety
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2F6BFF] transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2F6BFF] transition-colors">
                  Research Collaboration
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ParthibaMandal/SURAKSHA-Website"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#A69B88] hover:text-[#2F6BFF] transition-colors"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Application Workspaces */}
          <div>
            <h4 className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-3">
              Application Workspaces
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-[#2F6BFF] transition-colors">
                  Operations Command Centre
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-[#2F6BFF] transition-colors">
                  Citizen Flood-Safety Portal
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-[#2F6BFF] transition-colors">
                  Operator & Citizen Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#D8CBB3]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A69B88] gap-4">
          <span>© 2026 SURAKSHA, Scientific Flood-Intelligence and Disaster-Response Research Prototype.</span>
          <span className="text-center sm:text-right font-mono text-[11px] text-[#D8CBB3]">
            Not an official government warning authority.
          </span>
        </div>
      </div>
    </footer>
  );
};
