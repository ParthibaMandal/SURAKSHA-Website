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
    // Ignore clicks on UI buttons
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
      // Subtle 3D parallax hover tilt when not dragging
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
      // Shift + Drag orbits 3D tilt angle directly
      setRotation((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(50, dragStartRef.current!.rotX - dy * 0.25)),
        y: Math.max(-35, Math.min(35, dragStartRef.current!.rotY + dx * 0.25)),
      }));
    } else {
      // Standard Drag moves/pans the river map smoothly AND subtly banks the 3D angle
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
      className={`relative w-full h-full min-h-[320px] overflow-hidden select-none bg-[#03080E] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Ambient 3D Hydrological Glow Backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isSurge
            ? "radial-gradient(circle at 52% 46%, rgba(14, 165, 233, 0.24), rgba(2, 132, 199, 0.08) 48%, rgba(3, 8, 14, 0.96) 80%)"
            : "radial-gradient(circle at 52% 46%, rgba(6, 182, 212, 0.16), rgba(37, 99, 235, 0.06) 45%, rgba(3, 8, 14, 0.96) 78%)",
        }}
      />

      {/* Top-Left Basin Header Overlay (Fixed HUD above 3D Canvas) */}
      <div className="pointer-events-none absolute top-3.5 left-4 z-20 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-white font-sans">
            Ganga Basin, Patna Reach (25.61°N, 85.14°E)
          </span>
        </div>
        <span className="text-[10px] font-mono text-sky-300/75 pl-4">
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
              ? "bg-sky-500/25 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
              : "bg-black/60 border-white/15 text-zinc-300 hover:text-white hover:border-sky-400/50"
          }`}
          title="Toggle 3D river surge wave animation"
        >
          <Waves className="w-3 h-3 text-sky-400" />
          <span>{isSurge ? "SURGE FLOW: ON" : "SURGE FLOW"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIs3D((v) => !v)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
            is3D
              ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200"
              : "bg-black/60 border-white/15 text-zinc-300 hover:text-white"
          }`}
          title="Toggle 3D perspective tilt"
        >
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>{is3D ? "3D VIEW" : "2D VIEW"}</span>
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.12).toFixed(2)))}
          className="p-1.5 rounded-full bg-black/60 border border-white/15 text-zinc-300 hover:text-white hover:border-sky-400/50 backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.12).toFixed(2)))}
          className="p-1.5 rounded-full bg-black/60 border border-white/15 text-zinc-300 hover:text-white hover:border-sky-400/50 backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-full bg-black/60 border border-white/15 text-zinc-300 hover:text-white hover:border-sky-400/50 backdrop-blur-md transition-colors cursor-pointer"
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
            {/* 3D Terrain Bathymetry Grid Dots */}
            <pattern
              id="hydroGridDots3D"
              width="26"
              height="26"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#38BDF8" opacity="0.18" />
            </pattern>

            {/* Primary Luminous Cyan-Blue Ganga River Gradient */}
            <linearGradient id="gangaRiver3DGrad" x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#0EA5E9" stopOpacity="0.98" />
              <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>

            {/* Specular Crest Highlight Gradient */}
            <linearGradient id="gangaCoreHighlight" x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.85" />
            </linearGradient>

            {/* Floodplain Inundation Envelope Gradient */}
            <linearGradient id="floodplainEnvelopeGrad" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#0369A1" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.24" />
            </linearGradient>

            {/* 3D River Glow & Extrusion Shadow Filter */}
            <filter id="riverGlow3D" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="6"
                floodColor="#0284C7"
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
          <rect width="640" height="360" fill="#03080E" />
          <rect width="640" height="360" fill="url(#hydroGridDots3D)" />

          {/* Perspective Coordinate Graticule Lines */}
          <g stroke="#38BDF8" strokeOpacity="0.09" strokeDasharray="3 5">
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
            stroke="#38BDF8"
            strokeOpacity="0.16"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M15 35 Q170 98 310 56 T585 42"
            stroke="#38BDF8"
            strokeOpacity="0.14"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M75 355 Q205 298 345 328 T605 288"
            stroke="#0EA5E9"
            strokeOpacity="0.14"
            strokeWidth="1.2"
            fill="none"
          />

          {/* 3D Bathymetric Depth Shadow Underneath River Channel */}
          <path
            d={GANGA_PATH}
            stroke="#000000"
            strokeOpacity="0.75"
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
            stroke="#0EA5E9"
            strokeOpacity={isSurge ? "0.34" : "0.22"}
            strokeWidth={isSurge ? "44" : "30"}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
          />

          {/* Tributary 1: Gandak Feeder (North -> Confluence near Patna) */}
          <path
            d={GANDAK_PATH}
            stroke="#0284C7"
            strokeOpacity="0.3"
            strokeWidth={isSurge ? "18" : "12"}
            fill="none"
          />
          <path
            d={GANDAK_PATH}
            stroke="#38BDF8"
            strokeOpacity="0.9"
            strokeWidth={isSurge ? "6.5" : "4.5"}
            fill="none"
            filter="url(#riverGlow3D)"
          />
          <path
            d={GANDAK_PATH}
            stroke="#E0F2FE"
            strokeOpacity="0.85"
            strokeWidth="1.6"
            fill="none"
            strokeDasharray="6 12"
            className="animate-[flowStreamFast_5s_linear_infinite]"
          />

          {/* Tributary 2: Sone Sub-Basin Feeder (South-West -> Confluence) */}
          <path
            d={SONE_PATH}
            stroke="#0284C7"
            strokeOpacity="0.28"
            strokeWidth={isSurge ? "16" : "11"}
            fill="none"
          />
          <path
            d={SONE_PATH}
            stroke="#0EA5E9"
            strokeOpacity="0.9"
            strokeWidth={isSurge ? "5.5" : "4"}
            fill="none"
            filter="url(#riverGlow3D)"
          />
          <path
            d={SONE_PATH}
            stroke="#BAE6FD"
            strokeOpacity="0.85"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 12"
            className="animate-[flowStreamFast_6s_linear_infinite]"
          />

          {/* Primary 3D Ganga River Channel Body (Vibrant Hydro-Blue/Cyan with 3D Glow) */}
          <path
            d={GANGA_PATH}
            stroke="url(#gangaRiver3DGrad)"
            strokeWidth={isSurge ? "20" : "14"}
            strokeLinecap="round"
            fill="none"
            filter="url(#riverGlow3D)"
            className="transition-all duration-500"
          />

          {/* Inner Specular Water Core (Gives 3D Cylindrical Water Volume) */}
          <path
            d={GANGA_PATH}
            stroke="url(#gangaCoreHighlight)"
            strokeWidth={isSurge ? "6" : "4"}
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Animated Hydrodynamic Flow Streamlines */}
          <path
            d={GANGA_PATH}
            stroke="#FFFFFF"
            strokeOpacity="0.92"
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
            stroke="#7DD3FC"
            strokeOpacity="0.7"
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
              fill="#E0F2FE"
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
            <circle key={`gandak-pt-${idx}`} r="2" fill="#BAE6FD">
              <animateMotion dur="4.4s" begin={`${delay}s`} repeatCount="indefinite">
                <mpath href="#gandakMotionPath" />
              </animateMotion>
            </circle>
          ))}

          {[0.6, 2.8].map((delay, idx) => (
            <circle key={`sone-pt-${idx}`} r="2" fill="#7DD3FC">
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
            {/* 3D Vertical Pillar Shadow */}
            <line
              x1="360"
              y1="128"
              x2="360"
              y2="92"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeDasharray="2 2"
            />
            <circle
              cx="360"
              cy="128"
              r="16"
              fill="#0EA5E9"
              fillOpacity="0.24"
              className="animate-pulse"
            />
            <circle
              cx="360"
              cy="128"
              r="5.5"
              fill="#38BDF8"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Elevated Card Placed Above-Right of Bend (No Overlap with STN-MOK-04) */}
            <rect
              x="315"
              y="52"
              width="156"
              height="36"
              rx="8"
              fill="#06101A"
              fillOpacity="0.94"
              stroke={
                activeStation === "STN-PAT-01"
                  ? "#38BDF8"
                  : "rgba(56,189,248,0.4)"
              }
              strokeWidth={activeStation === "STN-PAT-01" ? "1.5" : "1"}
            />
            <text
              x="325"
              y="66"
              fill="#FFFFFF"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              Patna · Gandhi Ghat
            </text>
            <text
              x="325"
              y="79"
              fill="#38BDF8"
              fontSize="8.5"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              STN-PAT-01 ({isSurge ? "48.65m DGR" : "46.85m MSL"})
            </text>
          </g>

          {/* Station 2: STN-GAN-01 (Lalganj Warning Node - Amber Semantic State) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-GAN-01")}
          >
            <circle
              cx="236"
              cy="108"
              r="12"
              fill="#F59E0B"
              fillOpacity="0.28"
              className="animate-pulse"
            />
            <circle
              cx="236"
              cy="108"
              r="4.5"
              fill="#F59E0B"
              stroke="#000000"
              strokeWidth="1.5"
            />
            <rect
              x="98"
              y="88"
              width="128"
              height="22"
              rx="6"
              fill="#0A0E14"
              fillOpacity="0.94"
              stroke="rgba(245,158,11,0.45)"
            />
            <text
              x="106"
              y="102"
              fill="#FBBF24"
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
              fill="#38BDF8"
              fillOpacity="0.2"
            />
            <circle
              cx="176"
              cy="192"
              r="4.5"
              fill="#38BDF8"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <rect
              x="54"
              y="202"
              width="116"
              height="20"
              rx="6"
              fill="#06101A"
              fillOpacity="0.94"
              stroke="rgba(56,189,248,0.35)"
            />
            <text
              x="62"
              y="215"
              fill="#E0F2FE"
              fontSize="8"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              STN-SON-01 (48.12m)
            </text>
          </g>

          {/* Station 4: Downstream Reach (STN-MOK-04) - Positioned cleanly below-right of the river curve */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveStation("STN-MOK-04")}
          >
            <circle
              cx="500"
              cy="184"
              r="10"
              fill="#38BDF8"
              fillOpacity="0.2"
            />
            <circle
              cx="500"
              cy="184"
              r="4.5"
              fill="#38BDF8"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <line
              x1="500"
              y1="189"
              x2="500"
              y2="212"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity="0.7"
            />
            <rect
              x="440"
              y="212"
              width="122"
              height="22"
              rx="8"
              fill="#06101A"
              fillOpacity="0.94"
              stroke="rgba(56,189,248,0.38)"
            />
            <text
              x="501"
              y="226"
              fill="#E0F2FE"
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
      <div className="pointer-events-none absolute bottom-2.5 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-sky-200/75">
        <span>
          ACTIVE NODE: <strong className="text-sky-300">{activeStation}</strong> ·{" "}
          {is3D ? `3D TILT (${Math.round(rotation.x)}°, ${Math.round(rotation.y)}°)` : "2D PLANAR"}
        </span>
        <span className="hidden sm:inline text-sky-300/80">
          Drag to pan & tilt 3D river · Shift+Drag to orbit
        </span>
      </div>
    </div>
  );
};
