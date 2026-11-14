"use client";

import React, { useEffect, useRef, useState } from "react";
import { DigitalTwinEngine } from "@/lib/three/digital-twin-engine";
import { TacticalMapSvg } from "./TacticalMapSvg";
import { FallbackCanvas2D } from "./FallbackCanvas2D";
import { RotateCcw, AlertTriangle, Layers } from "lucide-react";

interface DigitalTwinSceneProps {
  onSurgeStateChange?: (isSurge: boolean) => void;
}

export const DigitalTwinScene: React.FC<DigitalTwinSceneProps> = ({ onSurgeStateChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<DigitalTwinEngine | null>(null);

  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [isSurge, setIsSurge] = useState(false);
  const [stageReading, setStageReading] = useState(49.82);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (viewMode !== "3d") return;
    if (!containerRef.current) return;

    try {
      const engine = new DigitalTwinEngine(containerRef.current, {
        onSurgeToggle: (active) => {
          setIsSurge(active);
          setStageReading(active ? 52.32 : 49.82);
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
      setStageReading(active ? 52.32 : 49.82);
      if (onSurgeStateChange) onSurgeStateChange(active);
    } else {
      const next = !isSurge;
      setIsSurge(next);
      setStageReading(next ? 52.32 : 49.82);
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
    <div className="relative w-full rounded-2xl border border-[#D8CBB3]/18 bg-[#292925] overflow-hidden shadow-xl transition-colors">
      {/* Visual Header */}
      <div className="px-5 py-3.5 border-b border-[#D8CBB3]/14 flex items-center justify-between bg-[#1E1E1C]">
        <div>
          <div className="text-xs font-bold text-[#D8CBB3] tracking-wide">
            Ganga Basin Hydrological Intelligence Workspace
          </div>
          <div className="text-[11px] text-[#A69B88]">
            3D Digital Twin · Drag to orbit basin topography
          </div>
        </div>
        <span className="pill text-[10px] font-mono border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3]">
          <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
          {viewMode === "3d" ? "3D TOPOGRAPHIC MESH" : "2D GEOSPATIAL VECTOR"}
        </span>
      </div>

      {/* Viewport Box */}
      <div className="relative w-full h-[340px] md:h-[400px] bg-[#1E1E1C]">
        {/* Controls Bar inside Viewport */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              viewMode === "3d"
                ? "bg-[#2F6BFF] text-white border-[#2F6BFF]"
                : "bg-[#292925] text-[#D8CBB3] border-[#D8CBB3]/20 hover:bg-[#33332E]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {viewMode === "3d" ? "3D Basin Twin" : "2D Map View"}
          </button>

          <button
            onClick={toggleSurge}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isSurge
                ? "bg-[#F59E0B] text-[#1E1E1C] border-[#F59E0B]"
                : "bg-[#292925] text-[#D8CBB3] border-[#D8CBB3]/20 hover:border-[#F59E0B]/60 hover:text-[#FBBF24]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isSurge ? "Surge Active (Synthetic)" : "Simulate Surge"}
          </button>

          {viewMode === "3d" && (
            <button
              onClick={resetCamera}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#292925] text-[#D8CBB3] border border-[#D8CBB3]/20 hover:bg-[#33332E] transition-colors"
              title="Reset 3D camera orientation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Viewport Canvas or Tactical Map */}
        {viewMode === "3d" && webGlSupported ? (
          <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          />
        ) : viewMode === "2d" ? (
          <TacticalMapSvg />
        ) : (
          <FallbackCanvas2D isSurge={isSurge} />
        )}

        {/* Floating HUD */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[#292925]/95 border border-[#D8CBB3]/20 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[#A69B88]">DATUM: 52.4m</span>
            <span className="text-[#7D7465]">|</span>
            <span
              className={`font-semibold tracking-wide ${
                isSurge ? "text-[#FBBF24]" : "text-[#2F6BFF]"
              }`}
            >
              STAGE: {stageReading.toFixed(2)}m {isSurge ? "(SYNTHETIC SURGE)" : "(SAMPLE NOMINAL)"}
            </span>
            <span className="text-[#7D7465]">|</span>
            <span className="text-[#D8CBB3]">STATIONS: 03 MAPPED</span>
          </div>
          <span className="text-[10px] text-[#A69B88] hidden sm:inline">
            ILLUSTRATIVE MODEL · NOT A LIVE FLOOD MAP
          </span>
        </div>
      </div>

      {/* 3 Metric Columns Row */}
      <div className="grid grid-cols-3 border-t border-[#D8CBB3]/14 divide-x divide-[#D8CBB3]/14 bg-[#1E1E1C] text-center py-3.5 px-2">
        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#A69B88] font-medium">
            River Stage
          </span>
          <strong className="text-xl font-bold font-mono text-[#D8CBB3] mt-0.5">
            {stageReading.toFixed(2)} m
          </strong>
          <small className="text-[10px] font-mono text-[#7D7465]">SAMPLE TELEMETRY</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#A69B88] font-medium">
            Forecast Trend
          </span>
          <strong
            className={`text-xl font-bold font-mono mt-0.5 ${
              isSurge ? "text-[#FBBF24]" : "text-[#2F6BFF]"
            }`}
          >
            {isSurge ? "+2.50 m / 3h" : "+0.42 m / 6h"}
          </strong>
          <small className="text-[10px] font-mono text-[#7D7465]">SYNTHETIC ENSEMBLE</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#A69B88] font-medium">
            Risk State
          </span>
          <strong
            className={`text-xl font-bold font-mono mt-0.5 ${
              isSurge ? "text-[#EF4444]" : "text-[#F59E0B]"
            }`}
          >
            {isSurge ? "Warning Level 3" : "Advisory Watch"}
          </strong>
          <small className="text-[10px] font-mono text-[#7D7465]">THRESHOLD MONITOR</small>
        </div>
      </div>
    </div>
  );
};
