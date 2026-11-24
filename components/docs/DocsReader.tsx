"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DocItem,
  getAllDocs,
  getDocCategories,
  getRelatedDocs,
} from "@/lib/docs";
import { StructuredDocRenderer } from "@/components/docs/renderers/StructuredDocRenderer";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Github,
  Share2,
  Search,
  CheckCircle2,
  Sparkles,
  FileCode,
  X,
  Menu,
  List,
} from "lucide-react";

interface DocsReaderProps {
  currentDoc: DocItem;
  onSelectDoc: (docId: string) => void;
  onBackToHome: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function DocsReader({
  currentDoc,
  onSelectDoc,
  onBackToHome,
  mobileMenuOpen,
  onToggleMobileMenu,
}: DocsReaderProps) {
  const allDocs = useMemo(() => getAllDocs(), []);
  const categories = useMemo(() => getDocCategories(), []);
  const relatedDocs = useMemo(() => getRelatedDocs(currentDoc, 3), [currentDoc]);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [currentDoc.categoryId]: true,
  });
  const [filterQuery, setFilterQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"interactive" | "raw">("interactive");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Keep current category expanded
  useEffect(() => {
    if (currentDoc) {
      setExpandedCategories((prev) => ({
        ...prev,
        [currentDoc.categoryId]: true,
      }));
    }
  }, [currentDoc]);

  // Scroll to top when doc changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentDoc.id]);

  // Active heading spy on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!currentDoc.headings || currentDoc.headings.length === 0) return;
      const headingElements = currentDoc.headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 140;
      let currentId = headingElements[0].id;

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          currentId = el.id;
        } else {
          break;
        }
      }

      setActiveHeadingId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentDoc]);

  // Toggle category in sidebar
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Previous and Next docs in sequence
  const currentIndex = allDocs.findIndex((d) => d.id === currentDoc.id);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  // Copy actions
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/docs?doc=${currentDoc.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyMarkdown = () => {
    if (currentDoc) {
      navigator.clipboard.writeText(currentDoc.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Filtered sidebar categories based on quick filter
  const filteredCategories = useMemo(() => {
    if (!filterQuery) return categories;
    const q = filterQuery.toLowerCase().trim();

    return categories
      .map((cat) => {
        const matchingDocs = cat.docs.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.summary.toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q)
        );
        return {
          ...cat,
          docs: matchingDocs,
        };
      })
      .filter((cat) => cat.docs.length > 0);
  }, [categories, filterQuery]);

  return (
    <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row overflow-visible bg-[var(--background)] text-[var(--foreground)] min-h-[calc(100vh-64px)] transition-colors duration-200">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={onToggleMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 1. Left Navigation Drawer / Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[var(--surface)] border-r border-[var(--border)] lg:static lg:w-64 xl:w-72 lg:bg-[var(--surface)]/50 lg:backdrop-blur-sm lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } flex flex-col h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 overflow-hidden`}
      >
        {/* Top actions in sidebar */}
        <div className="p-3 border-b border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Docs Hub</span>
            </button>
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick filter box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-emerald-500/50"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Doc Tree List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs divide-y divide-[var(--border)]/40">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] ?? false;
            const hasActiveDoc = cat.docs.some((d) => d.id === currentDoc.id);

            return (
              <div key={cat.id} className="pt-2 first:pt-0">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    hasActiveDoc
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10"
                      : "text-[var(--foreground)]/80 hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="truncate pr-2 font-medium">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {cat.docs.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-2 space-y-0.5 border-l border-[var(--border)] ml-2">
                    {cat.docs.map((doc) => {
                      const isSelected = doc.id === currentDoc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            onSelectDoc(doc.id);
                            if (mobileMenuOpen) onToggleMobileMenu();
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] leading-tight transition-all flex items-start gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          <span className="truncate">{doc.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* 2. Center Column: Main Editorial Article */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 xl:px-14 py-6 sm:py-10 max-w-4xl mx-auto overflow-x-hidden">
        {/* Mobile Sticky Quick Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] mb-6 text-xs shadow-xs">
          <button
            onClick={onToggleMobileMenu}
            className="flex items-center gap-1.5 font-medium text-[var(--foreground)] hover:text-emerald-500 cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Browse Guides</span>
          </button>
          {currentDoc.headings && currentDoc.headings.length > 0 && (
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="flex items-center gap-1.5 font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <List className="w-3.5 h-3.5 text-emerald-500" />
              <span>On this page</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Mobile Expandable Table of Contents */}
        {mobileTocOpen && currentDoc.headings && currentDoc.headings.length > 0 && (
          <div className="lg:hidden p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] mb-6 space-y-2 text-xs shadow-sm">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-wider block">
              Contents on this page
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {currentDoc.headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className={`block py-1 text-xs truncate ${
                    activeHeadingId === h.id
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {h.text}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-4 overflow-x-auto whitespace-nowrap font-medium">
          <button
            onClick={onBackToHome}
            className="hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            SURAKSHA Docs
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0 opacity-50" />
          <span className="truncate">
            {currentDoc.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0 opacity-50" />
          <span className="text-[var(--foreground)] font-semibold truncate">
            {currentDoc.title}
          </span>
        </div>

        {/* View Mode Switcher Header */}
        <div className="flex items-center justify-end pb-3">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs">
            <button
              onClick={() => setViewMode("interactive")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === "interactive"
                  ? "bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Editorial Guide</span>
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span>Raw Markdown</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        {viewMode === "interactive" ? (
          <StructuredDocRenderer doc={currentDoc} />
        ) : (
          <div className="my-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 font-mono text-xs text-[var(--foreground)] overflow-x-auto leading-relaxed shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)] text-[11px] text-[var(--muted-foreground)]">
              <span>Raw Document Source</span>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1 text-emerald-500 hover:underline cursor-pointer font-medium"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? "Copied" : "Copy Raw"}</span>
              </button>
            </div>
            <pre>
              <code>{currentDoc.content}</code>
            </pre>
          </div>
        )}

        {/* Previous and Next Navigation Footer */}
        <div className="pt-12 mt-12 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevDoc ? (
            <div
              onClick={() => onSelectDoc(prevDoc.id)}
              className="cursor-pointer group p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)] mb-1">
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-500 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Topic</span>
              </div>
              <div className="font-semibold text-sm text-[var(--foreground)] group-hover:text-emerald-500 transition-colors truncate">
                {prevDoc.title}
              </div>
            </div>
          ) : (
            <div />
          )}

          {nextDoc && (
            <div
              onClick={() => onSelectDoc(nextDoc.id)}
              className="cursor-pointer group p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40 transition-all text-right shadow-xs"
            >
              <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)] mb-1">
                <span>Next Topic</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-semibold text-sm text-[var(--foreground)] group-hover:text-emerald-500 transition-colors truncate">
                {nextDoc.title}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Right Column: Sticky Table of Contents & Tools (Desktop only) */}
      <aside className="hidden xl:block w-64 shrink-0 p-6 space-y-6 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)]/30">
        {/* In-page Table of Contents */}
        {currentDoc.headings && currentDoc.headings.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold block">
              On this page
            </span>
            <nav className="space-y-1 text-xs">
              {currentDoc.headings.map((h) => {
                const isActive = activeHeadingId === h.id;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block py-1 transition-colors leading-relaxed truncate ${
                      h.level === 3 ? "pl-3 text-[11px]" : ""
                    } ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500 pl-2"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {h.text}
                  </a>
                );
              })}
            </nav>
          </div>
        )}

        {/* Document Tools Card */}
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold block">
            Specification Actions
          </span>

          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface)] hover:border-emerald-500/30 border border-[var(--border)] text-xs text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <span>Share Link</span>
              </div>
              {copiedLink && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface)] hover:border-emerald-500/30 border border-[var(--border)] text-xs text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <span>Copy Markdown</span>
              </div>
              {copiedCode && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <a
              href={currentDoc.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface)] hover:border-emerald-500/30 border border-[var(--border)] text-xs text-[var(--foreground)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <span>GitHub Source</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)]" />
            </a>
          </div>
        </div>

        {/* Related Documents */}
        {relatedDocs && relatedDocs.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold block">
              Related Topics
            </span>
            <div className="space-y-2">
              {relatedDocs.map((rDoc) => (
                <div
                  key={rDoc.id}
                  onClick={() => onSelectDoc(rDoc.id)}
                  className="cursor-pointer p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/30 transition-colors space-y-1"
                >
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase block">
                    {rDoc.category}
                  </span>
                  <div className="text-xs font-medium text-[var(--foreground)] line-clamp-2">
                    {rDoc.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
