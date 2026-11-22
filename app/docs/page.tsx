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
        <div className="min-h-screen bg-black flex items-center justify-center text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Loading SURAKSHA Documentation...</span>
          </div>
        </div>
      }
    >
      <DocsPortal />
    </Suspense>
  );
}
