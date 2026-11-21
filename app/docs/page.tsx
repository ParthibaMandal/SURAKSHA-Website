import React, { Suspense } from "react";
import { Metadata } from "next";
import { DocsViewer } from "@/components/docs/DocsViewer";

export const metadata: Metadata = {
  title: "Documentation | SURAKSHA Flood Intelligence Platform",
  description:
    "Comprehensive technical documentation, architecture specifications, hydrological models, REST API reference, and operational runbooks for the SURAKSHA Ganga Basin Flood Intelligence Platform.",
};

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1E1E1C] flex items-center justify-center text-xs text-[#A69B88]">
          Loading SURAKSHA Documentation...
        </div>
      }
    >
      <DocsViewer />
    </Suspense>
  );
}
