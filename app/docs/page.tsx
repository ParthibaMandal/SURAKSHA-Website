import React, { Suspense } from "react";
import { Metadata } from "next";
import { DocsPortal } from "@/components/docs/DocsPortal";

export const metadata: Metadata = {
  title: "Documentation Hub | SURAKSHA Flood Intelligence Platform",
  description:
    "Comprehensive technical documentation, system architecture specifications, hydrological models, REST API reference, and operational runbooks for the SURAKSHA Ganga Basin Flood Intelligence Platform.",
};

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1E1E1C] flex items-center justify-center text-xs text-[#A69B88]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#2F6BFF] border-t-transparent animate-spin" />
            <span>Loading SURAKSHA Documentation Portal...</span>
          </div>
        </div>
      }
    >
      <DocsPortal />
    </Suspense>
  );
}
