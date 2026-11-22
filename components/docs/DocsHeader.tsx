"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Github, Menu, X, ArrowLeft } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/95 px-4 py-3 text-white backdrop-blur-md sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Version */}
        <div className="flex items-center gap-3">
          {isReaderMode && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-white/15 bg-[#0A0A0A] text-zinc-300 hover:text-white transition-colors"
              aria-label="Toggle Documentation Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link href="/docs" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-all group-hover:bg-white/10">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  SURAKSHA
                </span>
                <span className="text-xs font-normal text-zinc-400">Documentation</span>
              </div>
            </div>
          </Link>

          {/* Release Version & Count Badge */}
          <div className="hidden items-center gap-2 border-l border-white/10 pl-3 text-[11px] font-mono text-zinc-400 sm:flex">
            <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 font-medium">
              {metadata.releaseVersion}
            </span>
            <span>·</span>
            <span>{metadata.totalDocuments} Technical Docs</span>
          </div>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden items-center gap-6 text-xs text-zinc-400 lg:flex" aria-label="Documentation sections">
          <Link href="/docs" className="text-white font-medium">Docs</Link>
          <Link href="/platform" className="transition-colors hover:text-white">Platform</Link>
          <Link href="/research" className="transition-colors hover:text-white">Research</Link>
          <Link href="/about" className="transition-colors hover:text-white">About</Link>
        </nav>

        {/* Center Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#0A0A0A] px-3.5 py-2 text-xs text-zinc-400 shadow-sm transition-all hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search documentation...</span>
            </div>
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-full border border-white/15 bg-[#0A0A0A] text-zinc-300"
            aria-label="Search Documentation"
          >
            <Search className="w-4 h-4 text-white" />
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          <a
            href={`https://github.com/shouri123/SURAKSHA-Website/tree/main/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
