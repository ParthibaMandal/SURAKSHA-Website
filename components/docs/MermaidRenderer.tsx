"use client";

import React, { useEffect, useRef, useState } from "react";
import { Code2, Eye, AlertCircle } from "lucide-react";

interface MermaidRendererProps {
  chart: string;
  id: string;
}

export function MermaidRenderer({ chart, id }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart || typeof window === "undefined") return;

      try {
        setLoading(true);
        setError(null);

        // Dynamically import mermaid to avoid any SSR issues
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          themeVariables: {
            darkMode: true,
            background: "#090C10",
            primaryColor: "#06B6D4",
            primaryTextColor: "#F8FAFC",
            primaryBorderColor: "#0891B2",
            lineColor: "#38BDF8",
            secondaryColor: "#10161F",
            tertiaryColor: "#090C10",
            edgeLabelBackground: "#10161F",
            mainBkg: "#10161F",
            nodeBorder: "#06B6D4",
          },
        });

        // Generate safe unique ID
        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-_]/g, "")}-${Math.floor(
          Math.random() * 10000
        )}`;

        // Render diagram
        const { svg } = await mermaid.render(cleanId, chart);

        if (isMounted) {
          setSvgHtml(svg);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Mermaid render error:", err);
          setError(err?.message || "Failed to render Mermaid diagram.");
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#090C10] overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#10161F]/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06b6d4]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-white">
            Architecture Diagram
          </span>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
        >
          {showSource ? (
            <>
              <Eye className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>View Diagram</span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>View Source</span>
            </>
          )}
        </button>
      </div>

      {/* Main View Area */}
      {showSource ? (
        <pre className="p-4 text-xs font-mono text-slate-300 bg-[#06080B] overflow-x-auto leading-relaxed">
          <code>{chart}</code>
        </pre>
      ) : error ? (
        <div className="p-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-amber-400 mb-2 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Diagram Preview Unavailable</span>
          </div>
          <p className="mb-3 text-[11px]">
            The diagram definition uses advanced formatting. You can inspect the raw architecture logic below:
          </p>
          <pre className="p-3 rounded-xl bg-[#10161F] border border-white/10 font-mono text-[11px] text-white overflow-x-auto">
            <code>{chart}</code>
          </pre>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-xs text-slate-400">
          <div className="w-4 h-4 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin mr-2" />
          Rendering interactive diagram...
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-6 overflow-x-auto flex justify-center [&>svg]:max-w-full [&>svg]:h-auto bg-[#090C10]"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      )}
    </div>
  );
}
