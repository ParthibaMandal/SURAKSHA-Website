"use client";

import React, { useEffect, useRef, useState } from "react";
import { DigitalTwinEngine } from "@/lib/three/digital-twin-engine";
import { TacticalMapSvg } from "./TacticalMapSvg";
import { FallbackCanvas2D } from "./FallbackCanvas2D";
import { RotateCcw } from "lucide-react";

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

  // Initialize pure Three.js Digital Twin Engine
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
    <div className="relative w-full rounded-lg border border-[#1c2c34] bg-[#071115] overflow-hidden shadow-lg transition-colors">
      {/* Visual Header */}
      <div className="px-5 py-3 border-b border-[#1c2c34] flex items-center justify-between bg-[#050d11]">
        <div>
          <div className="text-xs font-semibold text-[#f0f7f6] tracking-wide">
            Hydrological intelligence workspace
          </div>
          <div className="text-[11px] text-[#9bb2af]">
            3D Digital Twin, interactive basin view
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-[#9bb2af] border border-[#1c2c34] bg-[#071115]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08a2be]" />
          {viewMode === "3d" ? "3D WebGL engine" : "2D tactical vector"}
        </span>
      </div>

      {/* Viewport Box */}
      <div className="relative w-full h-[340px] md:h-[400px]">
        {/* Controls Bar inside Viewport */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              viewMode === "3d"
                ? "bg-[#08a2be] text-[#03090c] border-[#08a2be]"
                : "bg-[#071115] text-[#9bb2af] border-[#1c2c34] hover:text-[#f0f7f6]"
            }`}
          >
            {viewMode === "3d" ? "3D Twin" : "2D Vector"}
          </button>

          <button
            onClick={toggleSurge}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              isSurge
                ? "bg-[#f59e0b] text-[#03090c] border-[#f59e0b]"
                : "bg-[#071115] text-[#9bb2af] border-[#1c2c34] hover:border-[#f59e0b]/50 hover:text-[#f59e0b]"
            }`}
          >
            {isSurge ? "Surge Active" : "Simulate Surge"}
          </button>

          {viewMode === "3d" && (
            <button
              onClick={resetCamera}
              className="px-2.5 py-1.5 rounded text-xs font-medium bg-[#071115] text-[#9bb2af] border border-[#1c2c34] hover:text-white transition-colors"
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
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 rounded border border-[#1c2c34] bg-[#071115] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#9bb2af]">Elevation: 52.4 m</span>
            <span
              className={`font-medium ${
                isSurge ? "text-[#f59e0b]" : "text-[#08a2be]"
              }`}
            >
              River stage: {stageReading.toFixed(2)} m {isSurge ? "(Surge alert)" : "(Normal)"}
            </span>
            <span className="text-[#9bb2af]">3 active telemetry feeds</span>
          </div>
          <span className="text-[11px] text-[#627b77] hidden sm:inline">
            Drag to orbit, tilt perspective
          </span>
        </div>
      </div>

      {/* 3 Metric Columns Row */}
      <div className="grid grid-cols-3 border-t border-[#1c2c34] divide-x divide-[#1c2c34] bg-[#050d11] text-center py-3.5 px-2">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9bb2af] font-medium">
            River stage
          </span>
          <strong className="text-xl font-bold text-[#f0f7f6] mt-0.5">
            {stageReading.toFixed(2)} m
          </strong>
          <small className="text-[11px] text-[#627b77]">Ganga gauge datum</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9bb2af] font-medium">
            Forecast trend
          </span>
          <strong
            className={`text-xl font-bold mt-0.5 ${
              isSurge ? "text-[#f59e0b]" : "text-[#08a2be]"
            }`}
          >
            {isSurge ? "+2.50 m / 3h" : "+0.42 m / 6h"}
          </strong>
          <small className="text-[11px] text-[#627b77]">Ensemble projection</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9bb2af] font-medium">
            Risk state
          </span>
          <strong
            className={`text-xl font-bold mt-0.5 ${
              isSurge ? "text-[#ef4444]" : "text-[#f59e0b]"
            }`}
          >
            {isSurge ? "Warning Level 3" : "Advisory Watch"}
          </strong>
          <small className="text-[11px] text-[#627b77]">Threshold condition</small>
        </div>
      </div>
    </div>
  );
};
