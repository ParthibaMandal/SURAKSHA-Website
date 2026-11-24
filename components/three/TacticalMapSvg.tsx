"use client";

import React, { useState, useRef } from "react";
import { RotateCcw, Waves, Compass, ZoomIn, ZoomOut } from "lucide-react";

const GANGA_PATH =
  "M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210";
const GANDAK_PATH = "M205 -10 C225 52 212 104 252 146";
const SONE_PATH = "M95 365 C135 280 155 215 190 165";

export const TacticalMapSvg: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Moveable 3D Camera State (Pan, 3D Tilt/Orbit, Zoom, Surge Animation)
  const [is3D, setIs3D] = useState(true);
  const [isSurge, setIsSurge] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 24, y: -6, z: -2 });
  const [zoom, setZoom] = useState(1.04);
  const [activeStation, setActiveStation] = useState<string>("STN-PAT-01");

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    panX: number;
    panY: number;
    rotX: number;
    rotY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      rotX: rotation.x,
      rotY: rotation.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) {
      if (!is3D || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setRotation((prev) => ({
        ...prev,
        x: Math.max(8, Math.min(40, 24 - ny * 12)),
        y: Math.max(-22, Math.min(22, -6 + nx * 16)),
      }));
      return;
    }

    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    if (e.shiftKey) {
      setRotation((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(50, dragStartRef.current!.rotX - dy * 0.25)),
        y: Math.max(-35, Math.min(35, dragStartRef.current!.rotY + dx * 0.25)),
      }));
    } else {
      setPan({
        x: Math.max(-140, Math.min(140, dragStartRef.current.panX + dx)),
        y: Math.max(-95, Math.min(95, dragStartRef.current.panY + dy)),
      });
      if (is3D) {
        setRotation((prev) => ({
          ...prev,
          x: Math.max(6, Math.min(44, dragStartRef.current!.rotX - dy * 0.08)),
          y: Math.max(-28, Math.min(28, dragStartRef.current!.rotY + dx * 0.1)),
        }));
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setRotation({ x: 24, y: -6, z: -2 });
    setZoom(1.04);
    setIs3D(true);
  };

  const sceneTransform = is3D
    ? `perspective(1050px) translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
    : `perspective(1050px) translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom}) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full min-h-[320px] overflow-hidden select-none bg-[#110805] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Ambient 3D Burnt Sienna Hydrological Glow Backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isSurge
            ? "radial-gradient(circle at 52% 46%, rgba(227, 83, 54, 0.30), rgba(160, 82, 45, 0.14) 48%, rgba(17, 8, 5, 0.96) 80%)"
            : "radial-gradient(circle at 52% 46%, rgba(244, 164, 96, 0.18), rgba(160, 82, 45, 0.09) 45%, rgba(17, 8, 5, 0.96) 78%)",
        }}
      />

      {/* Top-Left Basin Header Overlay */}
      <div className="pointer-events-none absolute top-3.5 left-4 z-20 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E35336] shadow-[0_0_10px_#E35336] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-[#F5F5DC] font-sans">
            Ganga Basin, Patna Reach (25.61°N, 85.14°E)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#F4A460]/85 pl-4">
          EPSG:4326 · Interactive 3D Hydrodynamic River Channel · Drag to Move
        </span>
      </div>

      {/* Top-Right Interactive 3D & Flow Controls Bar */}
      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsSurge((s) => !s)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
            isSurge
              ? "bg-[#E35336]/30 border-[#E35336] text-[#F5F5DC] shadow-[0_0_15px_rgba(227,83,54,0.45)]"
              : "bg-[#1A0D09]/80 border-[#A0522D]/60 text-[#F5F5DC]/85 hover:text-[#F5F5DC] hover:border-[#F4A460]"
          }`}
          title="Toggle 3D river surge wave animation"
        >
          <Waves className="w-3 h-3 text-[#F4A460]" />
          <span>{isSurge ? "SURGE FLOW: ON" : "SURGE FLOW"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIs3D((v) => !v)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
            is3D
              ? "bg-[#A0522D]/35 border-[#F4A460]/70 text-[#F5F5DC]"
              : "bg-[#1A0D09]/80 border-[#A0522D]/60 text-[#F5F5DC]/80 hover:text-[#F5F5DC]"
          }`}
          title="Toggle 3D perspective tilt"
        >
          <Compass className="w-3 h-3 text-[#F4A460]" />
          <span>{is3D ? "3D VIEW" : "2D VIEW"}</span>
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.12).toFixed(2)))}
          className="p-1.5 rounded-full bg-[#1A0D09]/80 border border-[#A0522D]/60 text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:border-[#F4A460] backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.12).toFixed(2)))}
          className="p-1.5 rounded-full bg-[#1A0D09]/80 border border-[#A0522D]/60 text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:border-[#F4A460] backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-full bg-[#1A0D09]/80 border border-[#A0522D]/60 text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:border-[#F4A460] backdrop-blur-md transition-colors cursor-pointer"
          title="Reset 3D camera position"
          aria-label="Reset camera"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* 3D Interactive Transform Stage */}
      <div
        className="w-full h-full transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: sceneTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 640 360"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Interactive 3D Ganga Basin Geospatial Schematic Map — Patna Study Area"
        >
          <defs>
            {/* 3D Terrain Bathymetry Grid Dots (#F4A460) */}
            <pattern
              id="siennaGridDots3D"
              width="26"
              height="26"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#F4A460" opacity="0.22" />
            </pattern>

            {/* Primary Luminous Burnt Sienna (#E35336) & Sandy Brown (#F4A460) Ganga River Gradient */}
            <linearGradient id="gangaRiver3DGrad" x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0%" stopColor="#A0522D" stopOpacity="0.96" />
              <stop offset="35%" stopColor="#E35336" stopOpacity="0.98" />
              <stop offset="70%" stopColor="#F4A460" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#E35336" stopOpacity="0.96" />
            </linearGradient>

            {/* Warm Beige (#F5F5DC) Specular Crest Highlight Gradient */}
            <linearGradient id="gangaCoreHighlight" x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0%" stopColor="#F5F5DC" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#F4A460" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#F5F5DC" stopOpacity="0.88" />
            </linearGradient>

            {/* Floodplain Inundation Envelope Gradient (#A0522D -> #E35336) */}
            <linearGradient id="floodplainEnvelopeGrad" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#A0522D" stopOpacity="0.26" />
              <stop offset="50%" stopColor="#E35336" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#F4A460" stopOpacity="0.26" />
            </linearGradient>

            {/* 3D River Glow & Extrusion Shadow Filter */}
            <filter id="riverGlow3D" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="6"
                floodColor="#E35336"
                floodOpacity="0.55"
              />
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Reusable Paths for SVG <animateMotion> Water Particles */}
            <path id="gangaMotionPath" d={GANGA_PATH} />
            <path id="gandakMotionPath" d={GANDAK_PATH} />
            <path id="soneMotionPath" d={SONE_PATH} />
          </defs>

          {/* Base Bathymetric Terrain & 3D Perspective Grid */}
          <rect width="640" height="360" fill="#110805" />
          <rect width="640" height="360" fill="url(#siennaGridDots3D)" />

          {/* Perspective Coordinate Graticule Lines */}
          <g stroke="#F4A460" strokeOpacity="0.12" strokeDasharray="3 5">
            <line x1="120" y1="0" x2="120" y2="360" />
            <line x1="260" y1="0" x2="260" y2="360" />
            <line x1="400" y1="0" x2="400" y2="360" />
            <line x1="540" y1="0" x2="540" y2="360" />
            <line x1="0" y1="90" x2="640" y2="90" />
            <line x1="0" y1="180" x2="640" y2="180" />
            <line x1="0" y1="270" x2="640" y2="270" />
          </g>

          {/* Topographic Elevation Contours (3D Basin Relief Lines) */}
          <path
            d="M0 295 Q140 215 245 248 T485 212 T640 145"
            stroke="#F4A460"
            strokeOpacity="0.22"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M15 35 Q170 98 310 56 T585 42"
            stroke="#A0522D"
            strokeOpacity="0.32"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M75 355 Q205 298 345 328 T605 288"
            stroke="#E35336"
            strokeOpacity="0.2"
            strokeWidth="1.2"
            fill="none"
          />

          {/* 3D Bathymetric Depth Shadow Underneath River Channel */}
          <path
            d={GANGA_PATH}
            stroke="#060201"
            strokeOpacity="0.82"
            strokeWidth={isSurge ? "68" : "52"}
            fill="none"
            transform="translate(0, 12)"
          />

          {/* 100-Year Floodplain Inundation Envelope (Animated Breathing Swell) */}
          <path
            d={GANGA_PATH}
            stroke="url(#floodplainEnvelopeGrad)"
            strokeWidth={isSurge ? "82" : "58"}
            strokeLinecap="round"
            fill="none"
            className="animate-[riverSwellPulse_4s_ease-in-out_infinite] transition-all duration-500"
          />

          {/* Inner Active Floodplain Corridor */}
          <path
            d={GANGA_PATH}
            stroke="#E35336"
            strokeOpacity={isSurge ? "0.38" : "0.24"}
            strokeWidth={isSurge ? "44" : "30"}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
          />

          {/* Tributary 1: Gandak Feeder (North -> Confluence near Patna) */}
          <path
            d={GANDAK_PATH}
            stroke="#A0522D"
            strokeOpacity="0.38"
            strokeWidth={isSurge ? "18" : "12"}
            fill="none"
          />
          <path
            d={GANDAK_PATH}
            stroke="#F4A460"
            strokeOpacity="0.92"
            strokeWidth={isSurge ? "6.5" : "4.5"}
            fill="none"
            filter="url(#riverGlow3D)"
          />
          <path
            d={GANDAK_PATH}
            stroke="#F5F5DC"
            strokeOpacity="0.88"
            strokeWidth="1.6"
            fill="none"
            strokeDasharray="6 12"
            className="animate-[flowStreamFast_5s_linear_infinite]"
          />

          {/* Tributary 2: Sone Sub-Basin Feeder (South-West -> Confluence) */}
          <path
            d={SONE_PATH}
            stroke="#A0522D"
            strokeOpacity="0.35"
            strokeWidth={isSurge ? "16" : "11"}
            fill="none"
          />
          <path
            d={SONE_PATH}
            stroke="#E35336"
            strokeOpacity="0.92"
            strokeWidth={isSurge ? "5.5" : "4"}
            fill="none"
            filter="url(#riverGlow3D)"
          />
          <path
            d={SONE_PATH}
            stroke="#F5F5DC"
            strokeOpacity="0.88"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 12"
            className="animate-[flowStreamFast_6s_linear_infinite]"
          />

          {/* Primary 3D Ganga River Channel Body (Burnt Sienna #E35336 & Sandy Brown #F4A460) */}
          <path
            d={GANGA_PATH}
            stroke="url(#gangaRiver3DGrad)"
            strokeWidth={isSurge ? "20" : "14"}
            strokeLinecap="round"
            fill="none"
            filter="url(#riverGlow3D)"
            className="transition-all duration-500"
          />

          {/* Inner Specular Water Core (#F5F5DC -> #F4A460) */}
          <path
            d={GANGA_PATH}
            stroke="url(#gangaCoreHighlight)"
            strokeWidth={isSurge ? "6" : "4"}
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Animated Hydrodynamic Flow Streamlines */}
          <path
            d={GANGA_PATH}
            stroke="#F5F5DC"
            strokeOpacity="0.94"
            strokeWidth={isSurge ? "2.6" : "2"}
            fill="none"
            strokeDasharray="12 18"
            className={
              isSurge
                ? "animate-[flowStreamFast_3.2s_linear_infinite]"
                : "animate-[flowStream_7s_linear_infinite]"
            }
          />

          {/* Secondary Counter-Phase Ripple Streamline */}
          <path
            d={GANGA_PATH}
            stroke="#F4A460"
            strokeOpacity="0.78"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="4 22"
            className="animate-[flowStream_5s_linear_infinite]"
          />

          {/* =====================================================================
              3D LAGRANGIAN FLOW PARTICLES (Moving along Ganga, Gandak, and Sone)
             ===================================================================== */}
          {[0, 1.8, 3.6, 5.4].map((delay, idx) => (
            <circle
              key={`ganga-pt-${idx}`}
              r={isSurge ? "3.5" : "2.5"}
              fill="#F5F5DC"
              filter="url(#riverGlow3D)"
            >
              <animateMotion
                dur={isSurge ? "4.5s" : "7.2s"}
                begin={`${delay}s`}
                repeatCount="indefinite"
              >
                <mpath href="#gangaMotionPath" />
              </animateMotion>
            </circle>
          ))}

          {[0, 2.2].map((delay, idx) => (
            <circle key={`gandak-pt-${idx}`} r="2" fill="#F5F5DC">
              <animateMotion dur="4.4s" begin={`${delay}s`} repeatCount="indefinite">
                <mpath href="#gandakMotionPath" />
              </animateMotion>
            </circle>
          ))}

          {[0.6, 2.8].map((delay, idx) => (
            <circle key={`sone-pt-${idx}`} r="2" fill="#F4A460">
              <animateMotion dur="4.8s" begin={`${delay}s`} repeatCount="indefinite">
                <mpath href="#soneMotionPath" />
              </animateMotion>
            </circle>
          ))}

          {/* =====================================================================
              3D ELEVATED MONITORING STATIONS (Non-Overlapping & Interactive)
             ===================================================================== */}

          {/* Station 1: STN-PAT-01 (Patna · Gandhi Ghat Primary Node) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-PAT-01")}
          >
            <line
              x1="360"
              y1="128"
              x2="360"
              y2="92"
              stroke="#F4A460"
              strokeWidth="1.4"
              strokeDasharray="2 2"
            />
            <circle
              cx="360"
              cy="128"
              r="16"
              fill="#E35336"
              fillOpacity="0.28"
              className="animate-pulse"
            />
            <circle
              cx="360"
              cy="128"
              r="5.5"
              fill="#E35336"
              stroke="#F5F5DC"
              strokeWidth="2"
            />
            <rect
              x="315"
              y="52"
              width="156"
              height="36"
              rx="8"
              fill="#1A0D09"
              fillOpacity="0.95"
              stroke={
                activeStation === "STN-PAT-01"
                  ? "#E35336"
                  : "rgba(244,164,96,0.5)"
              }
              strokeWidth={activeStation === "STN-PAT-01" ? "1.6" : "1"}
            />
            <text
              x="325"
              y="66"
              fill="#F5F5DC"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              Patna · Gandhi Ghat
            </text>
            <text
              x="325"
              y="79"
              fill="#F4A460"
              fontSize="8.5"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              STN-PAT-01 ({isSurge ? "48.65m DGR" : "46.85m MSL"})
            </text>
          </g>

          {/* Station 2: STN-GAN-01 (Lalganj Warning Node - Sandy Brown #F4A460) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-GAN-01")}
          >
            <circle
              cx="236"
              cy="108"
              r="12"
              fill="#F4A460"
              fillOpacity="0.28"
              className="animate-pulse"
            />
            <circle
              cx="236"
              cy="108"
              r="4.5"
              fill="#F4A460"
              stroke="#110805"
              strokeWidth="1.5"
            />
            <rect
              x="98"
              y="88"
              width="128"
              height="22"
              rx="6"
              fill="#1A0D09"
              fillOpacity="0.95"
              stroke="rgba(244,164,96,0.55)"
            />
            <text
              x="106"
              y="102"
              fill="#F4A460"
              fontSize="8"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              STN-GAN-01 (47.90m WARN)
            </text>
          </g>

          {/* Station 3: STN-SON-01 (Koelwar Sone Confluence Node) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-SON-01")}
          >
            <circle
              cx="176"
              cy="192"
              r="10"
              fill="#E35336"
              fillOpacity="0.25"
            />
            <circle
              cx="176"
              cy="192"
              r="4.5"
              fill="#E35336"
              stroke="#F5F5DC"
              strokeWidth="1.5"
            />
            <rect
              x="54"
              y="202"
              width="116"
              height="20"
              rx="6"
              fill="#1A0D09"
              fillOpacity="0.95"
              stroke="rgba(160,82,45,0.6)"
            />
            <text
              x="62"
              y="215"
              fill="#F5F5DC"
              fontSize="8"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              STN-SON-01 (48.12m)
            </text>
          </g>

          {/* Station 4: Downstream Reach (STN-MOK-04) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-MOK-04")}
          >
            <circle
              cx="500"
              cy="184"
              r="10"
              fill="#F4A460"
              fillOpacity="0.22"
            />
            <circle
              cx="500"
              cy="184"
              r="4.5"
              fill="#F4A460"
              stroke="#F5F5DC"
              strokeWidth="1.5"
            />
            <line
              x1="500"
              y1="189"
              x2="500"
              y2="212"
              stroke="#F4A460"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity="0.75"
            />
            <rect
              x="440"
              y="212"
              width="122"
              height="22"
              rx="8"
              fill="#1A0D09"
              fillOpacity="0.95"
              stroke="rgba(160,82,45,0.6)"
            />
            <text
              x="501"
              y="226"
              fill="#F5F5DC"
              fontSize="8"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
            >
              STN-MOK-04 (43.10m)
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Status Strip */}
      <div className="pointer-events-none absolute bottom-2.5 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-[#F5F5DC]/75">
        <span>
          ACTIVE NODE: <strong className="text-[#F4A460]">{activeStation}</strong> ·{" "}
          {is3D ? `3D TILT (${Math.round(rotation.x)}°, ${Math.round(rotation.y)}°)` : "2D PLANAR"}
        </span>
        <span className="hidden sm:inline text-[#F4A460]/85">
          Drag to pan & tilt 3D river · Shift+Drag to orbit
        </span>
      </div>
    </div>
  );
};
