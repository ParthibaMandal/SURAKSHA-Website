"use client";

import React, { useState } from "react";
import { Plus, Minus, Navigation, Layers, MapPin } from "lucide-react";

interface FloodForecastMapProps {
  waterLevel?: number;
  riskScore?: number;
}

export const FloodForecastMap: React.FC<FloodForecastMapProps> = ({
  waterLevel = 47.17,
  riskScore = 15,
}) => {
  const [viewMode, setViewMode] = useState<"map" | "levels" | "heatmap">("map");
  const [zoom, setZoom] = useState(1);

  // Inundation buffer scale based on risk score & stage
  const floodOpacity = Math.min(0.85, Math.max(0.25, 0.2 + (riskScore / 100) * 0.6));
  const floodSpread = Math.min(32, Math.max(8, 12 + (waterLevel - 46) * 10));

  return (
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 flex flex-col justify-between font-sans">
      {/* Top Header & View Tabs */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-white">Flood Forecast Overview</span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "map" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode("levels")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "levels" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Water Levels
          </button>
          <button
            type="button"
            onClick={() => setViewMode("heatmap")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "heatmap" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Risk Heatmap
          </button>
        </div>
      </div>

      {/* SVG Reach Vector Map */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 800 480"
          className="w-full h-full object-cover transition-transform duration-300 select-none"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            {/* Topographic Land Pattern */}
            <radialGradient id="landGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#18201B" />
              <stop offset="100%" stopColor="#0B100D" />
            </radialGradient>

            {/* Inundation Flood Glow */}
            <linearGradient id="floodWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity={floodOpacity} />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity={floodOpacity * 0.9} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={floodOpacity * 0.7} />
            </linearGradient>

            {/* Heatmap Gradient */}
            <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={riskScore > 50 ? "#EF4444" : "#F59E0B"} stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Land Surface */}
          <rect width="800" height="480" fill="url(#landGrad)" />

          {/* Grid lines */}
          <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
            <line x1="100" y1="0" x2="100" y2="480" />
            <line x1="250" y1="0" x2="250" y2="480" />
            <line x1="400" y1="0" x2="400" y2="480" />
            <line x1="550" y1="0" x2="550" y2="480" />
            <line x1="700" y1="0" x2="700" y2="480" />
            <line x1="0" y1="120" x2="800" y2="120" />
            <line x1="0" y1="240" x2="800" y2="240" />
            <line x1="0" y1="360" x2="800" y2="360" />
          </g>

          {/* Inundation Area Polygons (Simulated Flooding Footprint) */}
          <path
            d="M 60 210 Q 220 180 340 220 T 600 210 T 780 260 L 780 320 Q 560 310 420 330 T 180 300 Z"
            fill="url(#floodWaterGrad)"
            stroke="#38BDF8"
            strokeWidth={floodSpread > 20 ? "2.5" : "1.5"}
            className="transition-all duration-700 ease-out"
          />

          {/* Heatmap overlay (when active) */}
          {viewMode === "heatmap" && (
            <circle cx="420" cy="245" r="140" fill="url(#heatGlow)" className="animate-pulse" />
          )}

          {/* Main River Channel: River Ganga */}
          <path
            d="M -20 220 C 140 190 260 215 380 235 S 580 210 820 250"
            fill="none"
            stroke="#0284C7"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M -20 220 C 140 190 260 215 380 235 S 580 210 820 250"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Gandak River Tributary from North */}
          <path
            d="M 330 -10 Q 345 110 375 230"
            fill="none"
            stroke="#0284C7"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Sone River Tributary from South-West */}
          <path
            d="M 120 490 Q 180 370 230 220"
            fill="none"
            stroke="#0284C7"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Patna Urban Settlement Boundary Outline */}
          <path
            d="M 280 260 L 540 250 L 560 360 L 260 350 Z"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text x="360" y="315" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="sans-serif" letterSpacing="2">
            PATNA METROPOLITAN
          </text>

          {/* Gandhi Ghat Location Capsule (matching mockup) */}
          <g transform="translate(405, 230)" className="filter drop-shadow-md select-none">
            {/* Pulsing beacon ping */}
            <circle cx="0" cy="0" r="16" fill="#F97316" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />

            {/* White Capsule Badge */}
            <g transform="translate(10, -14)">
              <rect
                x="0"
                y="0"
                width="100"
                height="26"
                rx="13"
                fill="#FFFFFF"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
              {/* Orange Location Pin */}
              <circle cx="13" cy="13" r="4.5" fill="#EA580C" />
              <text
                x="24"
                y="17"
                fill="#0F172A"
                fontSize="11"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                Gandhi Ghat
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Overlay: Legend & Zoom Controls */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-end justify-between pointer-events-none">
        {/* Risk Legend */}
        <div className="bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/10 space-y-1 text-[10px] font-medium pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
            <span className="text-zinc-200">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
            <span className="text-zinc-200">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span className="text-zinc-200">Low Risk</span>
          </div>
        </div>

        {/* Floating Zoom & Orientation Controls */}
        <div className="flex flex-col gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/10 pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white grid place-items-center cursor-pointer transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.85, z - 0.15))}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white grid place-items-center cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white grid place-items-center cursor-pointer transition-colors"
            title="Reset View"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
