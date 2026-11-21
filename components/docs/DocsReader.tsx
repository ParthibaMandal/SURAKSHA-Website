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

      const scrollPosition = window.scrollY + 120;
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
    <div className="flex-1 max-w-[1500px] w-full mx-auto flex overflow-visible text-white">
      {/* 1. Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[#090C10] border-r border-white/10 lg:static lg:block transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-hidden`}
      >
        {/* Top actions in sidebar */}
        <div className="p-3 border-b border-white/10 space-y-2">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Docs Home</span>
          </button>

          {/* Quick filter box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#10161F]/80 border border-white/10 rounded-full pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Doc Tree List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs divide-y divide-white/5">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] ?? false;
            const hasActiveDoc = cat.docs.some((d) => d.id === currentDoc.id);

            return (
              <div key={cat.id} className="pt-2">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-full text-left transition-colors cursor-pointer ${
                    hasActiveDoc
                      ? "text-[#06B6D4] font-semibold bg-[#06B6D4]/10"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="truncate pr-2 font-medium">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {cat.docs.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-2 space-y-0.5 border-l border-white/10 ml-2">
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
                              ? "bg-[#06B6D4]/15 text-white font-medium border-l-2 border-[#06B6D4]"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
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

      {/* 2. Center Column: Main Article */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 overflow-x-hidden">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
          <button
            onClick={onBackToHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Docs
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="hover:text-white transition-colors truncate">
            {currentDoc.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-white font-medium truncate">
            {currentDoc.title}
          </span>
        </div>

        {/* Article Meta Bar */}
        <div className="pb-6 border-b border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium border ${
                  currentDoc.status === "VERIFIED"
                    ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                    : currentDoc.status === "IMPLEMENTED"
                    ? "bg-[#06B6D4]/15 text-[#38BDF8] border-[#06B6D4]/30"
                    : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                }`}
              >
                {currentDoc.status === "VERIFIED" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : currentDoc.status === "IMPLEMENTED" ? (
                  <Code2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                <span>{currentDoc.status}</span>
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentDoc.readingTime} min read</span>
              </span>

              <span className="text-xs text-slate-600">·</span>

              <span className="text-xs text-slate-400">
                {currentDoc.wordCount.toLocaleString()} words
              </span>

              <span className="text-xs text-slate-600">·</span>

              <a
                href={currentDoc.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1 font-mono"
              >
                <Github className="w-3 h-3" />
                <span>Source</span>
              </a>
            </div>

            {/* View Mode Switcher: Interactive UI vs Raw Spec */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#10161F] border border-white/10 text-xs">
              <button
                onClick={() => setViewMode("interactive")}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  viewMode === "interactive"
                    ? "bg-white text-[#090C10] shadow font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive UI View</span>
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  viewMode === "raw"
                    ? "bg-white text-[#090C10] shadow font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Raw Spec</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {currentDoc.title}
          </h1>

          {currentDoc.summary && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {currentDoc.summary}
            </p>
          )}
        </div>

        {/* Article Body: Interactive UI Component View OR Raw Specification */}
        {viewMode === "interactive" ? (
          <StructuredDocRenderer doc={currentDoc} />
        ) : (
          <div className="my-8 rounded-2xl border border-white/10 bg-[#090C10] p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-slate-400">
              <span>Raw Document Specification</span>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1 text-[#06B6D4] hover:underline cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? "Copied" : "Copy Raw"}</span>
              </button>
            </div>
            <pre>
              <code>{currentDoc.content}</code>
            </pre>
          </div>
        )}

        {/* Previous and Next Navigation Footer */}
        <div className="pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevDoc ? (
            <div
              onClick={() => onSelectDoc(prevDoc.id)}
              className="cursor-pointer group p-4 rounded-2xl border border-white/10 bg-[#10161F]/80 hover:border-[#06B6D4]/50 transition-all shadow-md"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <ArrowLeft className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Previous</span>
              </div>
              <div className="font-semibold text-xs text-white group-hover:text-[#38BDF8] truncate">
                {prevDoc.title}
              </div>
            </div>
          ) : (
            <div />
          )}

          {nextDoc && (
            <div
              onClick={() => onSelectDoc(nextDoc.id)}
              className="cursor-pointer group p-4 rounded-2xl border border-white/10 bg-[#10161F]/80 hover:border-[#06B6D4]/50 transition-all text-right shadow-md"
            >
              <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#06B6D4]" />
              </div>
              <div className="font-semibold text-xs text-white group-hover:text-[#38BDF8] truncate">
                {nextDoc.title}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Right Column: Sticky Table of Contents & Tools */}
      <aside className="hidden xl:block w-72 shrink-0 p-6 space-y-6 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
        {/* In-page Table of Contents */}
        {currentDoc.headings && currentDoc.headings.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
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
                        ? "text-[#06B6D4] font-semibold"
                        : "text-slate-400 hover:text-white"
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
        <div className="p-4 rounded-2xl border border-white/10 bg-[#10161F]/80 space-y-3 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Document Actions
          </span>

          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Copy Page Link</span>
              </div>
              {copiedLink && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Copy Specification</span>
              </div>
              {copiedCode && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
            </button>

            <a
              href={currentDoc.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Edit on GitHub</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Related Documents */}
        {relatedDocs && relatedDocs.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Related Documents
            </span>
            <div className="space-y-2">
              {relatedDocs.map((rDoc) => (
                <div
                  key={rDoc.id}
                  onClick={() => onSelectDoc(rDoc.id)}
                  className="cursor-pointer p-3 rounded-xl border border-white/10 bg-[#10161F]/60 hover:border-[#06B6D4]/50 transition-colors space-y-1"
                >
                  <span className="text-[9px] font-mono text-[#06B6D4] uppercase block">
                    {rDoc.category}
                  </span>
                  <div className="text-xs font-medium text-white line-clamp-2">
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
