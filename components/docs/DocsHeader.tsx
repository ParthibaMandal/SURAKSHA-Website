"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Github, Menu, X, ArrowLeft } from "lucide-react";
import { DocsManifestMetadata } from "@/lib/docs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2823] bg-black/95 px-4 py-3 text-white backdrop-blur-md sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Version */}
        <div className="flex items-center gap-3">
          {isReaderMode && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-md border border-[#1F2823] bg-[#0D100E] text-[#9BA5A0] hover:text-white transition-colors"
              aria-label="Toggle Documentation Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link href="/docs" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#1F2823] bg-[#141816] text-white transition-all group-hover:border-[#10B981]/50">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white font-heading">
                  SURAKSHA
                </span>
                <span className="text-xs font-normal text-[#9BA5A0]">Documentation</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden items-center gap-6 text-xs text-[#9BA5A0] lg:flex" aria-label="Documentation sections">
          <Link href="/docs" className="text-white font-medium">Docs</Link>
          <Link href="/platform" className="transition-colors hover:text-white">Platform</Link>
          <Link href="/research" className="transition-colors hover:text-white">Research</Link>
          <Link href="/about" className="transition-colors hover:text-white">About</Link>
        </nav>

        {/* Center Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between rounded-md border border-[#1F2823] bg-[#0D100E] px-3.5 py-2 text-xs text-[#9BA5A0] transition-colors hover:border-[#10B981]/40 hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#9BA5A0]" />
              <span>Search documentation...</span>
            </div>
            <kbd className="rounded border border-[#1F2823] px-1.5 py-0.5 text-[10px] font-mono text-[#9BA5A0]">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-md border border-[#1F2823] bg-[#0D100E] text-[#9BA5A0]"
            aria-label="Search Documentation"
          >
            <Search className="w-4 h-4 text-white" />
          </button>

          <ThemeToggle />

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#9BA5A0] hover:text-white transition-colors px-3 py-1.5 rounded-md border border-[#1F2823] bg-[#141816] hover:border-[#10B981]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          <a
            href={`https://github.com/shouri123/SURAKSHA-Website/tree/main/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#9BA5A0] hover:text-white transition-colors px-3 py-1.5 rounded-md border border-[#1F2823] bg-[#141816] hover:border-[#10B981]/40"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
