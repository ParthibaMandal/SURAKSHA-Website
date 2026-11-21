"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Github, ExternalLink, Menu, X, ArrowLeft } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090C10]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 text-white">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-3">
          {isReaderMode && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-white/15 bg-[#10161F] text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Documentation Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link
            href="/docs"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  SURAKSHA
                </span>
                <span className="text-xs text-slate-400 font-normal">Docs</span>
              </div>
            </div>
          </Link>

          {/* Version & Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/15">
            <span className="text-[#06B6D4] font-medium">{metadata.releaseVersion}</span>
            <span>·</span>
            <span>{metadata.totalDocuments} Technical Docs</span>
          </div>
        </div>

        {/* Center: Search Trigger (Pill-styled single working search trigger) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#10161F] hover:bg-[#16202C] border border-white/15 hover:border-[#06B6D4]/60 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Search 84 documents, architecture, APIs...</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300 border border-white/15 shadow-sm">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Links */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-full border border-white/15 bg-[#10161F] text-slate-300"
            aria-label="Search Documentation"
          >
            <Search className="w-4 h-4 text-[#06B6D4]" />
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          <a
            href={`https://github.com/shouri123/SURAKSHA/tree/${metadata.documentationCommit}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
