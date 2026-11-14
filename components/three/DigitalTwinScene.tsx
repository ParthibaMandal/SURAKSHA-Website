"use client";

import React, { useEffect, useRef, useState } from "react";
import { DigitalTwinEngine } from "@/lib/three/digital-twin-engine";
import { TacticalMapSvg } from "./TacticalMapSvg";
import { FallbackCanvas2D } from "./FallbackCanvas2D";
import { Activity, RotateCcw, AlertTriangle, Layers, Droplets } from "lucide-react";

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
    <div className="relative w-full rounded-2xl border border-[rgba(94,234,212,0.22)] bg-[rgba(15,23,27,0.85)] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.65)] hover:border-[#5eead4]/40 transition-all duration-300">
      {/* Visual Header matching index.html */}
      <div className="px-5 py-3.5 border-b border-[#2e4952]/40 flex items-center justify-between bg-black/25">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5 tracking-wide">
            <Droplets className="w-4 h-4 text-[#5eead4]" />
            Hydrological intelligence workspace
          </div>
          <div className="text-[11px] text-[#9bb2af]">
            3D Digital Twin · Drag to rotate basin view
          </div>
        </div>
        <span className="pill text-[10px] font-mono border-[#5eead4]/30 bg-[#0e1a1f]/80 text-[#c7dbd7]">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          {viewMode === "3d" ? "3D WEBGL ENGINE" : "2D TACTICAL VECTOR"}
        </span>
      </div>

      {/* Viewport Box */}
      <div className="relative w-full h-[340px] md:h-[400px]">
        {/* Controls Bar inside Viewport */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm ${
              viewMode === "3d"
                ? "bg-[#5eead4]/20 text-[#5eead4] border-[#5eead4]/50 shadow-[0_0_15px_rgba(94,234,212,0.2)]"
                : "bg-[#142329]/90 text-slate-300 border-[#2e4952] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {viewMode === "3d" ? "3D Twin" : "2D Tactical"}
          </button>

          <button
            onClick={toggleSurge}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm ${
              isSurge
                ? "bg-[#fbbf24]/30 text-[#fbbf24] border-[#fbbf24]/60 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse"
                : "bg-[#142329]/90 text-slate-300 border-[#2e4952] hover:border-[#fbbf24]/40 hover:text-amber-300"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isSurge ? "Surge Active" : "Simulate Surge"}
          </button>

          {viewMode === "3d" && (
            <button
              onClick={resetCamera}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#142329]/90 text-slate-300 border border-[#2e4952] hover:bg-suraksha-700/90 hover:text-white transition-all backdrop-blur-md shadow-sm"
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

        {/* Floating HUD matching index.html */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[#091418]/85 border border-[#5eead4]/25 backdrop-blur-md text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#9bb2af]">ELEV: 52.4m</span> ·
            <span
              className={`font-semibold tracking-wide transition-colors ${
                isSurge ? "text-[#fbbf24]" : "text-[#5eead4]"
              }`}
            >
              STAGE: {stageReading.toFixed(2)}m {isSurge ? "(SURGE ALERT)" : "(NORMAL)"}
            </span>{" "}
            · <span className="text-[#6ee7b7]">BEACONS: 3 LIVE</span>
          </div>
          <span className="text-[10px] text-[#627b77] hidden sm:inline">
            Drag to Orbit · Tilt Perspective
          </span>
        </div>
      </div>

      {/* 3 Metric Columns Row matching index.html lines 1710-1726 */}
      <div className="grid grid-cols-3 border-t border-[#2e4952]/40 divide-x divide-[#2e4952]/40 bg-black/30 text-center py-3.5 px-2">
        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#9bb2af] font-medium">
            River stage
          </span>
          <strong className="text-xl font-bold font-mono text-white mt-0.5">
            {stageReading.toFixed(2)} m
          </strong>
          <small className="text-[10px] text-[#627b77]">Sample telemetry feed</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#9bb2af] font-medium">
            Forecast trend
          </span>
          <strong
            className={`text-xl font-bold font-mono mt-0.5 ${
              isSurge ? "text-[#fbbf24]" : "text-[#5eead4]"
            }`}
          >
            {isSurge ? "+2.50 m / 3h" : "+0.42 m / 6h"}
          </strong>
          <small className="text-[10px] text-[#627b77]">Simulated ensemble</small>
        </div>

        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-wider text-[#9bb2af] font-medium">
            Risk state
          </span>
          <strong
            className={`text-xl font-bold font-mono mt-0.5 ${
              isSurge ? "text-[#f87171]" : "text-[#fbbf24]"
            }`}
          >
            {isSurge ? "Warning Level 3" : "Advisory"}
          </strong>
          <small className="text-[10px] text-[#627b77]">Threshold watch</small>
        </div>
      </div>
    </div>
  );
};
