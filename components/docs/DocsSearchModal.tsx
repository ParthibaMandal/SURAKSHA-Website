"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ChevronRight, Hash, ExternalLink, ArrowRight } from "lucide-react";
import { DocItem, searchDocs, getDocCategories } from "@/lib/docs";

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoc: (docId: string) => void;
}

export function DocsSearchModal({
  isOpen,
  onClose,
  onSelectDoc,
}: DocsSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => getDocCategories(), []);

  // Filter docs
  const results = useMemo(() => {
    return searchDocs(query, selectedCat);
  }, [query, selectedCat]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setSelectedCat("All");
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        onSelectDoc(results[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectDoc, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[var(--foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
          <Search className="w-5 h-5 text-[var(--muted-foreground)] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 84 documents, architecture, models, APIs..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border border-[var(--border)]">
            Esc
          </kbd>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]/50 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => {
              setSelectedCat("All");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCat === "All"
                ? "bg-emerald-500 text-white font-semibold"
                : "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
            }`}
          >
            All Categories ({results.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCat(c.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === c.id
                  ? "bg-emerald-500 text-white font-semibold"
                  : "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
              }`}
            >
              {c.name} ({c.docCount})
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--muted-foreground)]">
              No technical documentation matching &quot;{query}&quot;
            </div>
          ) : (
            results.map((doc, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDoc(doc.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "hover:bg-[var(--surface)] border border-transparent"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]">
                        {doc.category}
                      </span>
                      <span className="text-[11px] text-[var(--muted-foreground)]/70 font-mono">
                        {doc.readingTime} min read
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                      {doc.summary}
                    </p>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-emerald-500 translate-x-1" : "text-[var(--muted-foreground)]/40"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
