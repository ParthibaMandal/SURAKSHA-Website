"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import {
  DocItem,
  getAllDocs,
  getDocCategories,
  getRelatedDocs,
  DocHeading,
} from "@/lib/docs";
import { MermaidRenderer } from "@/components/docs/MermaidRenderer";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Github,
  Hash,
  Share2,
  Bookmark,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Tag,
  Menu,
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

  const articleContentRef = useRef<HTMLDivElement>(null);

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

  // Split markdown into regular markdown sections and mermaid blocks
  // to render mermaid dynamically with React components
  const contentBlocks = useMemo(() => {
    if (!currentDoc) return [];

    const raw = currentDoc.content;
    const blocks: { type: "markdown" | "mermaid"; content: string; id: string }[] = [];

    // Split by ```mermaid ... ```
    const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let diagramCounter = 0;

    while ((match = mermaidRegex.exec(raw)) !== null) {
      const markdownBefore = raw.substring(lastIndex, match.index);
      if (markdownBefore.trim()) {
        blocks.push({
          type: "markdown",
          content: markdownBefore,
          id: `md-${blocks.length}`,
        });
      }

      blocks.push({
        type: "mermaid",
        content: match[1].trim(),
        id: `diagram-${diagramCounter++}`,
      });

      lastIndex = mermaidRegex.lastIndex;
    }

    const remainingMarkdown = raw.substring(lastIndex);
    if (remainingMarkdown.trim()) {
      blocks.push({
        type: "markdown",
        content: remainingMarkdown,
        id: `md-${blocks.length}`,
      });
    }

    return blocks;
  }, [currentDoc]);

  // Render a markdown string into sanitized HTML with custom marked extensions
  const renderMarkdownChunk = (mdText: string) => {
    try {
      marked.setOptions({
        gfm: true,
        breaks: false,
      });

      let text = mdText;

      // GitHub alert callout replacement: > [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT], > [!CAUTION]
      text = text.replace(
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

          return `<div class="my-6 p-4 rounded-xl border-l-4 ${borderColor} ${bgColor} text-xs leading-relaxed"><div class="font-bold text-[#EDE4D3] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">${label}</div><div class="text-[#D8CBB3]">${body.trim()}</div></div>`;
        }
      );

      // Render marked HTML
      const rawHtml = marked.parse(text) as string;

      // Inject deterministic heading IDs and anchor links into <h2>, <h3>, <h4>
      const htmlWithAnchors = rawHtml.replace(
        /<h([2-4])>([\s\S]*?)<\/h\1>/gi,
        (m, level, content) => {
          const cleanText = content.replace(/<[^>]+>/g, "").trim();
          const id = cleanText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return `<h${level} id="${id}" class="group scroll-mt-24 relative flex items-center justify-between">${content}<a href="#${id}" class="opacity-0 group-hover:opacity-100 text-[#2F6BFF] ml-2 text-xs" aria-label="Link to section">#</a></h${level}>`;
        }
      );

      // Sanitize HTML
      return DOMPurify.sanitize(htmlWithAnchors, {
        ADD_ATTR: ["target", "id", "class"],
      });
    } catch (e) {
      return `<p>Error rendering documentation chunk.</p>`;
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
    <div className="flex-1 max-w-[1500px] w-full mx-auto flex overflow-visible">
      {/* 1. Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[#1E1E1C] border-r border-[#D8CBB3]/15 lg:static lg:block transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-hidden`}
      >
        {/* Top actions in sidebar */}
        <div className="p-3 border-b border-[#D8CBB3]/10 space-y-2">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#A69B88] hover:text-[#EDE4D3] hover:bg-[#292925] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Docs Home</span>
          </button>

          {/* Quick filter box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B88]" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#292925] border border-[#D8CBB3]/15 rounded-lg pl-8 pr-7 py-1 text-xs text-[#EDE4D3] placeholder-[#A69B88] focus:outline-none focus:border-[#2F6BFF]"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A69B88] hover:text-[#EDE4D3]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Doc Tree List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs divide-y divide-[#D8CBB3]/5">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] ?? false;
            const hasActiveDoc = cat.docs.some((d) => d.id === currentDoc.id);

            return (
              <div key={cat.id} className="pt-2">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
                    hasActiveDoc
                      ? "text-[#2F6BFF] font-semibold"
                      : "text-[#EDE4D3] hover:bg-[#292925]"
                  }`}
                >
                  <span className="truncate pr-2 font-medium">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-[#A69B88]">
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
                  <div className="mt-1 pl-2 space-y-0.5 border-l border-[#D8CBB3]/15 ml-2">
                    {cat.docs.map((doc) => {
                      const isSelected = doc.id === currentDoc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            onSelectDoc(doc.id);
                            if (mobileMenuOpen) onToggleMobileMenu();
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] leading-tight transition-all flex items-start gap-1.5 ${
                            isSelected
                              ? "bg-[#2F6BFF]/15 text-[#EDE4D3] font-medium border-l-2 border-[#2F6BFF]"
                              : "text-[#D8CBB3] hover:bg-[#292925] hover:text-[#EDE4D3]"
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
        <div className="flex items-center gap-2 text-xs text-[#A69B88] mb-4 overflow-x-auto whitespace-nowrap">
          <button
            onClick={onBackToHome}
            className="hover:text-[#EDE4D3] transition-colors"
          >
            Docs
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A69B88]/60 shrink-0" />
          <span className="hover:text-[#EDE4D3] transition-colors truncate">
            {currentDoc.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A69B88]/60 shrink-0" />
          <span className="text-[#EDE4D3] font-medium truncate">
            {currentDoc.title}
          </span>
        </div>

        {/* Article Meta Bar */}
        <div className="pb-6 border-b border-[#D8CBB3]/15 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                currentDoc.status === "VERIFIED"
                  ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                  : currentDoc.status === "IMPLEMENTED"
                  ? "bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30"
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

            <span className="text-xs text-[#A69B88] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentDoc.readingTime} min read</span>
            </span>

            <span className="text-xs text-[#A69B88]">·</span>

            <span className="text-xs text-[#A69B88]">
              {currentDoc.wordCount.toLocaleString()} words
            </span>

            <span className="text-xs text-[#A69B88]">·</span>

            <a
              href={currentDoc.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2F6BFF] hover:underline flex items-center gap-1 font-mono"
            >
              <Github className="w-3 h-3" />
              <span>View Source</span>
            </a>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#EDE4D3]">
            {currentDoc.title}
          </h1>

          {currentDoc.summary && (
            <p className="text-sm text-[#A69B88] leading-relaxed">
              {currentDoc.summary}
            </p>
          )}
        </div>

        {/* Article Body with Markdown & Mermaid */}
        <div
          ref={articleContentRef}
          className="py-8 prose prose-invert max-w-none 
            prose-headings:text-[#EDE4D3] prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#D8CBB3]/10 prose-h2:pb-2
            prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-sm prose-p:text-[#D8CBB3] prose-p:leading-relaxed prose-p:my-4
            prose-ul:text-sm prose-ul:text-[#D8CBB3] prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
            prose-ol:text-sm prose-ol:text-[#D8CBB3] prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
            prose-li:my-1.5
            prose-code:text-[#60A5FA] prose-code:font-mono prose-code:text-xs prose-code:bg-[#292925] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#141413] prose-pre:border prose-pre:border-[#D8CBB3]/15 prose-pre:p-4 prose-pre:rounded-xl
            prose-table:w-full prose-table:text-xs prose-table:my-6 prose-table:border prose-table:border-[#D8CBB3]/20
            prose-th:bg-[#292925] prose-th:text-[#EDE4D3] prose-th:p-2.5 prose-th:text-left prose-th:border-b prose-th:border-[#D8CBB3]/20
            prose-td:p-2.5 prose-td:border-b prose-td:border-[#D8CBB3]/10
            prose-a:text-[#2F6BFF] prose-a:underline hover:prose-a:text-[#60A5FA]"
        >
          {contentBlocks.map((block) => {
            if (block.type === "mermaid") {
              return (
                <MermaidRenderer
                  key={block.id}
                  id={block.id}
                  chart={block.content}
                />
              );
            }
            return (
              <div
                key={block.id}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownChunk(block.content),
                }}
              />
            );
          })}
        </div>

        {/* Previous and Next Navigation Footer */}
        <div className="pt-10 border-t border-[#D8CBB3]/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevDoc ? (
            <div
              onClick={() => onSelectDoc(prevDoc.id)}
              className="cursor-pointer group p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF] transition-all"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A69B88] mb-1">
                <ArrowLeft className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>Previous</span>
              </div>
              <div className="font-semibold text-xs text-[#EDE4D3] group-hover:text-[#60A5FA] truncate">
                {prevDoc.title}
              </div>
            </div>
          ) : (
            <div />
          )}

          {nextDoc && (
            <div
              onClick={() => onSelectDoc(nextDoc.id)}
              className="cursor-pointer group p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF] transition-all text-right"
            >
              <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono text-[#A69B88] mb-1">
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2F6BFF]" />
              </div>
              <div className="font-semibold text-xs text-[#EDE4D3] group-hover:text-[#60A5FA] truncate">
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
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A69B88] block">
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
                        ? "text-[#2F6BFF] font-semibold"
                        : "text-[#A69B88] hover:text-[#EDE4D3]"
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
        <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A69B88] block">
            Document Actions
          </span>

          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1E1E1C] hover:bg-[#343430] text-xs text-[#D8CBB3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>Copy Page Link</span>
              </div>
              {copiedLink && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1E1E1C] hover:bg-[#343430] text-xs text-[#D8CBB3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>Copy Raw Markdown</span>
              </div>
              {copiedCode && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
            </button>

            <a
              href={currentDoc.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1E1E1C] hover:bg-[#343430] text-xs text-[#D8CBB3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>Edit on GitHub</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#A69B88]" />
            </a>
          </div>
        </div>

        {/* Related Documents */}
        {relatedDocs && relatedDocs.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A69B88] block">
              Related Documents
            </span>
            <div className="space-y-2">
              {relatedDocs.map((rDoc) => (
                <div
                  key={rDoc.id}
                  onClick={() => onSelectDoc(rDoc.id)}
                  className="cursor-pointer p-3 rounded-lg border border-[#D8CBB3]/10 bg-[#242421] hover:border-[#2F6BFF]/50 transition-colors space-y-1"
                >
                  <span className="text-[9px] font-mono text-[#2F6BFF] uppercase block">
                    {rDoc.category}
                  </span>
                  <div className="text-xs font-medium text-[#EDE4D3] line-clamp-2">
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
