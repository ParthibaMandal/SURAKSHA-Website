"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  intensity = 15,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);

  const [glareOpacity, setGlareOpacity] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlarePos({ x: (mouseX / width) * 100, y: (mouseY / height) * 100 });
    setGlareOpacity(0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlareOpacity(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-xl border border-suraksha-700/60 bg-suraksha-900/60 p-6 backdrop-blur-md transition-shadow hover:shadow-xl hover:shadow-cyan-950/20 hover:border-cyan-500/40 ${className}`}
    >
      {/* Glare Reflection Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: glareOpacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(94, 234, 212, 0.4), transparent 65%)`,
        }}
      />
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
};

