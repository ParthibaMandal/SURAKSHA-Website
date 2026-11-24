"use client";

import React, { useEffect, useRef, useState } from "react";
import { DigitalTwinEngine } from "@/lib/three/digital-twin-engine";
import { TacticalMapSvg } from "./TacticalMapSvg";
import { FallbackCanvas2D } from "./FallbackCanvas2D";
import { RotateCcw, AlertTriangle, Layers, Hand } from "lucide-react";

interface DigitalTwinSceneProps {
  onSurgeStateChange?: (isSurge: boolean) => void;
}

export const DigitalTwinScene: React.FC<DigitalTwinSceneProps> = ({ onSurgeStateChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<DigitalTwinEngine | null>(null);

  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [isSurge, setIsSurge] = useState(false);
  const [stageReading, setStageReading] = useState(46.85);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [mobileInteracting, setMobileInteracting] = useState(false);

  useEffect(() => {
    if (viewMode !== "3d") return;
    if (!containerRef.current) return;

    try {
      const engine = new DigitalTwinEngine(containerRef.current, {
        onSurgeToggle: (active) => {
          setIsSurge(active);
          setStageReading(active ? 48.85 : 46.85);
          if (onSurgeStateChange) onSurgeStateChange(active);
        },
      });
      engineRef.current = engine;
      setWebGlSupported(true);

      return () => {
        engine.destroy();
        engineRef.current = null;
      };
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to procedural 2D canvas:", e);
      setWebGlSupported(false);
    }
  }, [viewMode, onSurgeStateChange]);

  const toggleSurge = () => {
    if (engineRef.current) {
      const active = engineRef.current.toggleSurge();
      setIsSurge(active);
      setStageReading(active ? 48.85 : 46.85);
      if (onSurgeStateChange) onSurgeStateChange(active);
    } else {
      const next = !isSurge;
      setIsSurge(next);
      setStageReading(next ? 48.85 : 46.85);
      if (onSurgeStateChange) onSurgeStateChange(next);
    }
  };

  const resetCamera = () => {
    if (engineRef.current) {
      engineRef.current.resetCamera();
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "3d" ? "2d" : "3d"));
  };

  return (
    <div className="relative w-full h-full rounded-2xl border border-[#A0522D]/45 bg-[#1A0D09] backdrop-blur-xl overflow-hidden shadow-xl transition-colors flex flex-col justify-between text-[#F5F5DC]">
      {/* Visual Header */}
      <div className="px-5 py-3.5 border-b border-[#A0522D]/35 flex items-center justify-between bg-[#110805]">
        <div>
          <div className="text-xs font-semibold text-[#F5F5DC] tracking-wide">
            Ganga Basin Hydrological Intelligence Workspace
          </div>
          <div className="text-[11px] text-[#F5F5DC]/70">
            3D Digital Twin (drag to orbit basin topography)
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#F4A460] bg-[#24120C] border border-[#A0522D]/50 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#E35336]" />
          <span className="whitespace-nowrap">{viewMode === "3d" ? "3D Basin View" : "2D Map View"}</span>
        </div>
      </div>

      {/* Viewport Box */}
      <div className="relative w-full flex-1 min-h-[340px] md:min-h-[400px] bg-[#110805] overflow-hidden">
        {/* Controls Bar inside Viewport */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap ${
              viewMode === "3d"
                ? "bg-[#E35336] text-[#F5F5DC] border-[#F4A460]"
                : "bg-[#1A0D09]/80 text-[#F5F5DC] border-[#A0522D]/60 hover:bg-[#24120C]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === "3d" ? "3D Basin Twin" : "2D Map View"}</span>
          </button>

          <button
            onClick={toggleSurge}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap ${
              isSurge
                ? "bg-[#E35336] text-[#F5F5DC] border-[#F5F5DC] shadow-[0_0_14px_rgba(227,83,54,0.5)]"
                : "bg-[#1A0D09]/80 text-[#F4A460] border-[#A0522D]/60 hover:border-[#F4A460]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isSurge ? "Surge Active (Breach)" : "Simulate Surge"}</span>
          </button>

          {viewMode === "3d" && (
            <button
              onClick={resetCamera}
              className="p-2 rounded-full text-xs font-medium bg-[#1A0D09]/80 text-[#F5F5DC] border border-[#A0522D]/60 hover:border-[#F4A460] transition-colors cursor-pointer"
              title="Reset 3D camera orientation"
              aria-label="Reset 3D camera orientation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Tap-to-Activate Guard */}
        {viewMode === "3d" && webGlSupported && !mobileInteracting && (
          <div
            onClick={() => setMobileInteracting(true)}
            className="md:hidden absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#110805]/65 backdrop-blur-[2px] cursor-pointer p-4 text-center"
          >
            <div className="px-4 py-2.5 rounded-full bg-[#1A0D09] border border-[#A0522D]/60 text-xs font-medium text-[#F5F5DC] shadow-xl flex items-center gap-2">
              <Hand className="w-4 h-4 text-[#F4A460]" />
              <span>Tap to rotate 3D digital twin</span>
            </div>
          </div>
        )}

        {/* Viewport Canvas or Tactical Map */}
        {viewMode === "3d" && webGlSupported ? (
          <div
            ref={containerRef}
            className={`w-full h-full select-none ${
              mobileInteracting
                ? "cursor-grab active:cursor-grabbing pointer-events-auto"
                : "pointer-events-none md:pointer-events-auto cursor-grab active:cursor-grabbing"
            }`}
          />
        ) : viewMode === "2d" ? (
          <TacticalMapSvg />
        ) : (
          <FallbackCanvas2D isSurge={isSurge} />
        )}

        {/* Floating HUD */}
        <div className="absolute bottom-3 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-[#1A0D09]/92 backdrop-blur-md border border-[#A0522D]/50 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[#F5F5DC]/70">Gandhi Ghat Datum: 46.20m</span>
            <span className="text-[#A0522D]">|</span>
            <span
              className={`font-semibold tracking-wide ${
                isSurge ? "text-[#E35336]" : "text-[#F4A460]"
              }`}
            >
              Stage: <span className="font-mono">{stageReading.toFixed(2)} m</span>{" "}
              {isSurge ? "(Danger breach 48.60m)" : "(Nominal)"}
            </span>
            <span className="text-[#A0522D]">|</span>
            <span className="text-[#F5F5DC]/85">3 stations active</span>
          </div>
          <span className="text-[10px] text-[#F4A460] hidden sm:inline font-mono">
            CWC Middle Ganga Reach Model
          </span>
        </div>
      </div>
    </div>
  );
};
