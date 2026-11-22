"use client";

import React, { useEffect, useRef } from "react";

interface FallbackCanvas2DProps {
  isSurge?: boolean;
}

export const FallbackCanvas2D: React.FC<FallbackCanvas2DProps> = ({ isSurge = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let rotX = 0.55;
    let rotY = 0.35;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      rotY += dx * 0.006;
      rotX += dy * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    const project = (x: number, y: number, z: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Rotate Y
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = 280 / (z2 + 60);
      return {
        x: canvas.width / 2 + x1 * scale * 7.5,
        y: canvas.height / 2 + y2 * scale * 7.5,
      };
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.02;

      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 400;

      // Pure black canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Topographic elevation contour grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;

      const gridSize = 14;
      const step = 2.4;

      for (let i = -gridSize; i <= gridSize; i += 2) {
        ctx.beginPath();
        for (let j = -gridSize; j <= gridSize; j += 2) {
          const elev = Math.sin(i * 0.2 + t * 0.5) * Math.cos(j * 0.2) * 1.5;
          const p = project(i * step, elev, j * step);
          if (j === -gridSize) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Procedural river wave stream
      ctx.strokeStyle = isSurge ? "rgba(245, 158, 11, 0.95)" : "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = isSurge ? 4 : 2.5;
      ctx.beginPath();
      for (let x = -26; x <= 26; x += 1.5) {
        const wave = Math.sin(x * 0.35 + t * 2) * 0.6;
        const baseZ = isSurge ? -1.2 : -3.2;
        const p = project(x, 0, baseZ + wave);
        if (x === -26) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Station beacons
      const beacons = [
        { x: -14, y: 0, label: "STN-SON-01", color: "#F59E0B" },
        { x: 2, y: 1, label: "STN-PAT-01", color: "#FFFFFF" },
        { x: 16, y: -1, label: "STN-GAN-01", color: "#A1A1AA" },
      ];

      beacons.forEach((b) => {
        const p = project(b.x, b.y, 0);
        const pulse = 10 + Math.sin(t * 3) * 5;

        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#A1A1AA";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(b.label, p.x + 8, p.y - 8);
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [isSurge]);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />;
};
