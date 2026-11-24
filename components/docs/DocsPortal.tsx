"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getManifest,
  getAllDocs,
  getDocById,
  DocItem,
} from "@/lib/docs";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsHomepage } from "@/components/docs/DocsHomepage";
import { DocsReader } from "@/components/docs/DocsReader";
import { DocsSearchModal } from "@/components/docs/DocsSearchModal";

export function DocsPortal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const manifest = useMemo(() => getManifest(), []);
  const allDocs = useMemo(() => getAllDocs(), []);

  // Selected doc ID from query parameter: ?doc=...
  const docParam = searchParams?.get("doc");

  const [currentDoc, setCurrentDoc] = useState<DocItem | null>(() => {
    if (docParam) {
      return getDocById(docParam) || null;
    }
    return null;
  });

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state if URL query changes
  useEffect(() => {
    if (docParam) {
      const found = getDocById(docParam);
      if (found) {
        setCurrentDoc(found);
      } else {
        setCurrentDoc(null);
      }
    } else {
      setCurrentDoc(null);
    }
  }, [docParam]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectDoc = (docId: string) => {
    const found = getDocById(docId);
    if (found) {
      setCurrentDoc(found);
      router.push(`/docs?doc=${found.id}`, { scroll: true });
    }
  };

  const handleBackToHome = () => {
    setCurrentDoc(null);
    router.push("/docs", { scroll: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-emerald-500/20 selection:text-[var(--foreground)] transition-colors duration-200">
      {/* Sticky Docs Header */}
      <DocsHeader
        metadata={manifest.metadata}
        onOpenSearch={() => setSearchModalOpen(true)}
        isReaderMode={currentDoc !== null}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content Area */}
      {currentDoc ? (
        <DocsReader
          currentDoc={currentDoc}
          onSelectDoc={handleSelectDoc}
          onBackToHome={handleBackToHome}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      ) : (
        <DocsHomepage
          manifest={manifest}
          onOpenSearch={() => setSearchModalOpen(true)}
          onSelectDoc={handleSelectDoc}
        />
      )}

      {/* Quick Search Modal */}
      <DocsSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectDoc={handleSelectDoc}
      />
    </div>
  );
}
