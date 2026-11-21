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
    let angle = -0.4;
    let isDown = false;
    let lastX = 0;
    let t = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      lastX = e.clientX;
    };
    const onMouseUp = () => {
      isDown = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDown) {
        angle += (e.clientX - lastX) * 0.008;
        lastX = e.clientX;
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.03;
      if (!isDown) angle += 0.002;

      const w = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 280);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + 30;
      const fov = 380;
      const dist = 55;

      const project = (x: number, y: number, z: number) => {
        const rx = x * Math.cos(angle) - y * Math.sin(angle);
        const ry = x * Math.sin(angle) + y * Math.cos(angle);
        const rz = z;
        const pitch = 0.55;
        const py = ry * Math.cos(pitch) - rz * Math.sin(pitch);
        const pz = ry * Math.sin(pitch) + rz * Math.cos(pitch);
        const scale = fov / (dist + py);
        return { x: cx + rx * scale, y: cy - pz * scale };
      };

      // Sand terrain wireframe
      ctx.strokeStyle = "rgba(216, 203, 179, 0.28)";
      ctx.lineWidth = 1;

      for (let y = -14; y <= 14; y += 2) {
        ctx.beginPath();
        for (let x = -26; x <= 26; x += 2) {
          const canyon = Math.exp(-Math.pow(y, 2) / 20) * -5.5;
          const z = canyon + Math.sin(x * 0.18) * 2 + Math.cos(y * 0.22) * 1.5;
          const p = project(x, y, z);
          if (x === -26) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Procedural river wave stream (Electric Blue nominal, Amber surge)
      ctx.strokeStyle = isSurge ? "rgba(245, 158, 11, 0.95)" : "rgba(47, 107, 255, 0.95)";
      ctx.lineWidth = isSurge ? 4 : 3;
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
        { x: 2, y: 1, label: "STN-PAT-01", color: "#06B6D4" },
        { x: 16, y: -1, label: "STN-GAN-01", color: "#D8CBB3" },
      ];

      beacons.forEach((b) => {
        const p = project(b.x, b.y, 0);
        const pulse = 10 + Math.sin(t * 3) * 5;

        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#EDE4D3";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#D8CBB3";
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
