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
            background: "#000000",
            primaryColor: "#FFFFFF",
            primaryTextColor: "#FFFFFF",
            primaryBorderColor: "rgba(255, 255, 255, 0.2)",
            lineColor: "#A1A1AA",
            secondaryColor: "#0A0A0A",
            tertiaryColor: "#000000",
            edgeLabelBackground: "#0A0A0A",
            mainBkg: "#0A0A0A",
            nodeBorder: "rgba(255, 255, 255, 0.2)",
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
    <div className="my-6 rounded-2xl border border-white/10 bg-black overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0A0A0A] text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white" />
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
              <Eye className="w-3.5 h-3.5 text-white" />
              <span>View Diagram</span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>View Raw Spec</span>
            </>
          )}
        </button>
      </div>

      {/* Render Area */}
      <div className="p-4 sm:p-6 overflow-x-auto min-h-[160px] flex items-center justify-center bg-black">
        {loading ? (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-8">
            <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span>Rendering diagram...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-300 flex items-start gap-2.5 max-w-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Diagram Specification</strong>
              <pre className="mt-2 p-2 rounded bg-black/60 overflow-x-auto text-[11px] text-zinc-300 font-mono">
                {chart}
              </pre>
            </div>
          </div>
        ) : showSource ? (
          <pre className="w-full text-xs font-mono text-zinc-300 bg-[#0A0A0A] p-4 rounded-xl border border-white/10 overflow-x-auto">
            {chart}
          </pre>
        ) : (
          <div
            ref={containerRef}
            className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>
    </div>
  );
}
