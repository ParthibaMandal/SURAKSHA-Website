"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Github, ExternalLink, Menu, X, ArrowLeft, Shield } from "lucide-react";
import { DocsManifestMetadata } from "@/lib/docs";

interface DocsHeaderProps {
  metadata: DocsManifestMetadata;
  onOpenSearch: () => void;
  isReaderMode?: boolean;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function DocsHeader({
  metadata,
  onOpenSearch,
  isReaderMode = false,
  mobileMenuOpen = false,
  onToggleMobileMenu,
}: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8CBB3]/15 bg-[#1E1E1C]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-3">
          {isReaderMode && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3] hover:text-[#EDE4D3] transition-colors"
              aria-label="Toggle Documentation Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link
            href="/docs"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 flex items-center justify-center text-[#2F6BFF] group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#EDE4D3]">
                  SURAKSHA
                </span>
                <span className="text-xs text-[#A69B88] font-normal">Docs</span>
              </div>
            </div>
          </Link>

          {/* Version & Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#292925] text-[#A69B88] border border-[#D8CBB3]/15">
            <span className="text-[#2F6BFF] font-medium">{metadata.releaseVersion}</span>
            <span>·</span>
            <span>{metadata.totalDocuments} Documents</span>
          </div>
        </div>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#292925] hover:bg-[#32322E] border border-[#D8CBB3]/20 hover:border-[#2F6BFF]/50 text-xs text-[#A69B88] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#A69B88]" />
              <span>Search 84 documents, architecture, APIs...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20 shadow-sm">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Links */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3]"
            aria-label="Search Documentation"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#A69B88] hover:text-[#EDE4D3] transition-colors px-2.5 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          <a
            href={`https://github.com/shouri123/SURAKSHA/tree/${metadata.documentationCommit}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#292925] hover:bg-[#343430] border border-[#D8CBB3]/20 text-xs text-[#EDE4D3] transition-colors"
            title={`Backend Commit: ${metadata.documentationCommit}`}
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {metadata.documentationCommit.slice(0, 7)}
            </span>
            <ExternalLink className="w-3 h-3 text-[#A69B88]" />
          </a>
        </div>
      </div>
    </header>
  );
}
