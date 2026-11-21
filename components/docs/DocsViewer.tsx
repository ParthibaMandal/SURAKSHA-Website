"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { marked } from "marked";
import {
  DocItem,
  getAllDocs,
  getDocCategories,
  getDocById,
} from "@/lib/docs";
import {
  Search,
  BookOpen,
  Folder,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Code2,
  Copy,
  Check,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
} from "lucide-react";

export function DocsViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allDocs = useMemo(() => getAllDocs(), []);
  const categories = useMemo(() => getDocCategories(), []);

  // Selected doc ID from query or default to readme
  const docParam = searchParams?.get("doc");
  const initialDoc = useMemo(() => {
    if (docParam) {
      return getDocById(docParam) || allDocs[0];
    }
    return allDocs[0];
  }, [docParam, allDocs]);

  const [currentDoc, setCurrentDoc] = useState<DocItem>(initialDoc);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Overview & Knowledge Map": true,
    "Project Foundation": true,
    "System Architecture": true,
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Sync state if URL query changes
  useEffect(() => {
    if (docParam) {
      const found = getDocById(docParam);
      if (found && found.id !== currentDoc.id) {
        setCurrentDoc(found);
        // Expand the category of the selected doc
        setExpandedCategories((prev) => ({
          ...prev,
          [found.category]: true,
        }));
      }
    }
  }, [docParam, currentDoc.id]);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectDoc = (doc: DocItem) => {
    setCurrentDoc(doc);
    setMobileSidebarOpen(false);
    router.push(`/docs?doc=${doc.id}`, { scroll: false });
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Filtered docs based on search and category filter
  const filteredDocs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allDocs.filter((doc) => {
      const matchesCategory =
        selectedCategory === "All" || doc.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.path.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q)
      );
    });
  }, [allDocs, searchQuery, selectedCategory]);

  // Render markdown to HTML with marked
  const renderedContentHtml = useMemo(() => {
    if (!currentDoc) return "";
    try {
      // Configure marked options
      marked.setOptions({
        gfm: true,
        breaks: false,
      });

      let raw = currentDoc.content;

      // Handle github alert callouts like > [!NOTE] or > [!WARNING]
      raw = raw.replace(
        />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)(?=(?:\n\n[^\s>]|\n?$))/gi,
        (match, type, body) => {
          const typeUpper = type.toUpperCase();
          let borderColor = "border-[#2F6BFF]";
          let bgColor = "bg-[#2F6BFF]/10";
          let label = "NOTE";

          if (typeUpper === "WARNING" || typeUpper === "CAUTION") {
            borderColor = "border-[#F59E0B]";
            bgColor = "bg-[#F59E0B]/10";
            label = "WARNING";
          } else if (typeUpper === "IMPORTANT") {
            borderColor = "border-[#EF4444]";
            bgColor = "bg-[#EF4444]/10";
            label = "IMPORTANT";
          } else if (typeUpper === "TIP") {
            borderColor = "border-[#10B981]";
            bgColor = "bg-[#10B981]/10";
            label = "TIP";
          }

          return `<div class="my-5 p-4 rounded-lg border-l-4 ${borderColor} ${bgColor} text-xs leading-relaxed"><div class="font-bold text-[#EDE4D3] uppercase tracking-wider mb-1">${label}</div><div>${body.trim()}</div></div>`;
        }
      );

      return marked.parse(raw);
    } catch (e) {
      return `<p>Error rendering markdown document.</p>`;
    }
  }, [currentDoc]);

  // Current doc index for Prev / Next navigation
  const currentIndex = allDocs.findIndex((d) => d.id === currentDoc.id);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/docs?doc=${currentDoc.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyContent = () => {
    if (currentDoc) {
      navigator.clipboard.writeText(currentDoc.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E1C] text-[#D8CBB3]">
      {/* Top Header & Search Bar */}
      <div className="sticky top-16 z-30 w-full border-b border-[#D8CBB3]/15 bg-[#1E1E1C]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3] hover:text-[#EDE4D3]"
              aria-label="Toggle Docs Sidebar"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2F6BFF]" />
              <span className="font-bold text-sm tracking-tight text-[#EDE4D3]">
                SURAKSHA Documentation
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                84 Docs · v1.0
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A69B88]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search architecture, models, APIs, runbooks... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#292925] border border-[#D8CBB3]/20 rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#EDE4D3] placeholder-[#A69B88] focus:outline-none focus:border-[#2F6BFF]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A69B88] hover:text-[#EDE4D3]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Documentation Layout */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[#1E1E1C] border-r border-[#D8CBB3]/15 lg:static lg:block transform transition-transform duration-200 ease-in-out ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } flex flex-col h-[calc(100vh-64px)] overflow-hidden`}
        >
          {/* Category Filter Pills */}
          <div className="p-3 border-b border-[#D8CBB3]/10">
            <span className="text-[10px] uppercase tracking-wider text-[#A69B88] font-mono block mb-2">
              Browse Categories ({categories.length})
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategory === "All"
                    ? "bg-[#2F6BFF] text-white font-medium"
                    : "bg-[#292925] text-[#A69B88] hover:text-[#EDE4D3]"
                }`}
              >
                All ({allDocs.length})
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-[#2F6BFF] text-white font-medium"
                      : "bg-[#292925] text-[#A69B88] hover:text-[#EDE4D3]"
                  }`}
                >
                  {cat.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Documentation Tree List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {searchQuery ? (
              // Search Results View
              <div>
                <div className="text-[11px] font-mono text-[#A69B88] mb-2 px-1">
                  Search Results: {filteredDocs.length} document(s)
                </div>
                <div className="space-y-1">
                  {filteredDocs.map((doc) => {
                    const isSelected = doc.id === currentDoc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex flex-col gap-1 ${
                          isSelected
                            ? "bg-[#2F6BFF]/15 text-[#EDE4D3] border border-[#2F6BFF]/40 font-medium"
                            : "text-[#D8CBB3] hover:bg-[#292925] hover:text-[#EDE4D3]"
                        }`}
                      >
                        <span className="font-medium line-clamp-1">{doc.title}</span>
                        <span className="text-[10px] text-[#A69B88] font-mono line-clamp-1">
                          {doc.category}
                        </span>
                      </button>
                    );
                  })}
                  {filteredDocs.length === 0 && (
                    <div className="p-4 text-center text-[#A69B88] text-xs">
                      No matching documents found.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Standard Categorized Tree View
              categories
                .filter(
                  (cat) =>
                    selectedCategory === "All" || cat.name === selectedCategory
                )
                .map((cat) => {
                  const isExpanded = !!expandedCategories[cat.name];
                  return (
                    <div key={cat.name} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left font-semibold text-[#EDE4D3] hover:bg-[#292925] transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="w-3.5 h-3.5 text-[#2F6BFF]" />
                          <span className="line-clamp-1">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#A69B88] px-1.5 py-0.2 rounded bg-[#1E1E1C]">
                            {cat.docs.length}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#A69B88]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#A69B88]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="pl-3.5 ml-2 border-l border-[#D8CBB3]/15 space-y-0.5">
                          {cat.docs.map((doc) => {
                            const isSelected = doc.id === currentDoc.id;
                            return (
                              <button
                                key={doc.id}
                                onClick={() => handleSelectDoc(doc)}
                                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors text-xs flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-[#2F6BFF]/20 text-[#EDE4D3] font-semibold border-l-2 border-[#2F6BFF]"
                                    : "text-[#A69B88] hover:text-[#EDE4D3] hover:bg-[#292925]"
                                }`}
                              >
                                <FileText className="w-3 h-3 shrink-0 opacity-70" />
                                <span className="truncate">{doc.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </aside>

        {/* Center Content Document Viewer */}
        <main
          ref={contentAreaRef}
          className="flex-1 min-w-0 h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-8 lg:p-10"
        >
          {/* Breadcrumb Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#D8CBB3]/15 mb-6 text-xs text-[#A69B88]">
            <div className="flex items-center gap-1.5">
              <Link href="/docs" className="hover:text-[#EDE4D3]">
                Docs
              </Link>
              <span>/</span>
              <span className="text-[#EDE4D3] font-medium">{currentDoc.category}</span>
              <span>/</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentDoc.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#292925] border border-[#D8CBB3]/20 hover:text-[#EDE4D3] transition-colors"
                title="Copy direct share link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyContent}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#292925] border border-[#D8CBB3]/20 hover:text-[#EDE4D3] transition-colors"
                title="Copy raw markdown text"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <a
                href={currentDoc.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#292925] border border-[#D8CBB3]/20 hover:text-[#EDE4D3] text-[#2F6BFF] transition-colors"
              >
                <span>GitHub Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Document Title & Meta Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                {currentDoc.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#A69B88]">
                <Clock className="w-3 h-3" />
                {currentDoc.readingTime} min read ({currentDoc.wordCount} words)
              </span>
              <span className="font-mono text-[11px] text-[#A69B88]">
                docs/{currentDoc.path}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#EDE4D3] tracking-tight">
              {currentDoc.title}
            </h1>

            {currentDoc.summary && (
              <p className="text-sm text-[#A69B88] leading-relaxed max-w-3xl">
                {currentDoc.summary}
              </p>
            )}
          </div>

          {/* Main Markdown Body with custom styling */}
          <div
            className="prose prose-invert max-w-none text-[#D8CBB3] text-sm leading-relaxed
              prose-headings:text-[#EDE4D3] prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-[#D8CBB3]/15 prose-h2:pb-2
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
              prose-p:my-3 prose-p:leading-relaxed
              prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
              prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5
              prose-li:my-1
              prose-a:text-[#2F6BFF] prose-a:underline hover:prose-a:text-[#5286FF]
              prose-code:text-[#EDE4D3] prose-code:bg-[#292925] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs
              prose-pre:bg-[#141A22] prose-pre:border prose-pre:border-[#D8CBB3]/20 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto
              prose-table:w-full prose-table:my-5 prose-table:border-collapse prose-table:text-xs
              prose-th:bg-[#292925] prose-th:text-[#EDE4D3] prose-th:border prose-th:border-[#D8CBB3]/20 prose-th:p-2.5 prose-th:text-left
              prose-td:border prose-td:border-[#D8CBB3]/15 prose-td:p-2.5 prose-td:text-[#D8CBB3]
              prose-blockquote:border-l-4 prose-blockquote:border-[#2F6BFF] prose-blockquote:bg-[#292925]/60 prose-blockquote:p-3 prose-blockquote:my-4 prose-blockquote:rounded-r prose-blockquote:italic
            "
            dangerouslySetInnerHTML={{ __html: renderedContentHtml }}
          />

          {/* Prev / Next Pagination Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 mt-12 border-t border-[#D8CBB3]/15">
            {prevDoc ? (
              <button
                onClick={() => handleSelectDoc(prevDoc)}
                className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF] transition-colors text-left flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#A69B88] mb-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Document</span>
                </div>
                <div className="text-sm font-semibold text-[#EDE4D3] line-clamp-1">
                  {prevDoc.title}
                </div>
                <div className="text-[11px] font-mono text-[#A69B88] mt-1">
                  {prevDoc.category}
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextDoc && (
              <button
                onClick={() => handleSelectDoc(nextDoc)}
                className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF] transition-colors text-right flex flex-col justify-between sm:items-end"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#A69B88] mb-1">
                  <span>Next Document</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-semibold text-[#EDE4D3] line-clamp-1">
                  {nextDoc.title}
                </div>
                <div className="text-[11px] font-mono text-[#A69B88] mt-1">
                  {nextDoc.category}
                </div>
              </button>
            )}
          </div>
        </main>

        {/* Right Sticky Table of Contents (Desktop only) */}
        {currentDoc.headings && currentDoc.headings.length > 0 && (
          <aside className="hidden xl:block w-64 p-6 border-l border-[#D8CBB3]/15 overflow-y-auto text-xs h-[calc(100vh-64px)]">
            <div className="sticky top-0">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] font-mono text-[#EDE4D3] mb-3">
                <Bookmark className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>On This Page</span>
              </div>
              <nav className="space-y-1.5 text-[#A69B88]">
                {currentDoc.headings
                  .filter((h) => h.level >= 2 && h.level <= 3)
                  .map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className={`block py-1 transition-colors hover:text-[#EDE4D3] ${
                        h.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
