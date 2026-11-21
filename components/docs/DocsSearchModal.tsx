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
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#1E1E1C] border border-[#D8CBB3]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#D8CBB3]/15 bg-[#242421]">
          <Search className="w-5 h-5 text-[#2F6BFF] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 84 documents, architecture, models, APIs..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-[#EDE4D3] placeholder-[#A69B88] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#A69B88] hover:text-[#EDE4D3] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1E1E1C] text-[#A69B88] border border-[#D8CBB3]/20">
            Esc
          </kbd>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#D8CBB3]/10 bg-[#1A1A18] overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => {
              setSelectedCat("All");
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
              selectedCat === "All"
                ? "bg-[#2F6BFF] text-white font-medium"
                : "bg-[#292925] text-[#A69B88] hover:text-[#EDE4D3]"
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
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                selectedCat === c.id
                  ? "bg-[#2F6BFF] text-white font-medium"
                  : "bg-[#292925] text-[#A69B88] hover:text-[#EDE4D3]"
              }`}
            >
              {c.name} ({c.docCount})
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#D8CBB3]/5"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A69B88]">
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
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-[#292925] border border-[#2F6BFF]/40"
                      : "hover:bg-[#242421]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E1E1C] text-[#2F6BFF] border border-[#2F6BFF]/20">
                        {doc.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                          doc.status === "VERIFIED"
                            ? "border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10"
                            : doc.status === "IMPLEMENTED"
                            ? "border-[#3B82F6]/40 text-[#60A5FA] bg-[#3B82F6]/10"
                            : "border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <span className="text-[10px] text-[#A69B88] font-mono">
                        {doc.readingTime} min read
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-[#EDE4D3] truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-[#A69B88] line-clamp-1 mt-0.5">
                      {doc.summary}
                    </p>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${
                      isSelected ? "text-[#2F6BFF] opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#D8CBB3]/10 bg-[#1A1A18] flex items-center justify-between text-[11px] text-[#A69B88]">
          <div className="flex items-center gap-3">
            <span>
              Navigate with <kbd className="font-mono text-[10px] bg-[#292925] px-1 rounded">↑</kbd>{" "}
              <kbd className="font-mono text-[10px] bg-[#292925] px-1 rounded">↓</kbd>
            </span>
            <span>
              Select with <kbd className="font-mono text-[10px] bg-[#292925] px-1 rounded">Enter</kbd>
            </span>
          </div>
          <span className="font-mono">{results.length} total matches</span>
        </div>
      </div>
    </div>
  );
}

