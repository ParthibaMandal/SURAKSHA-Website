"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowRight, Menu, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/platform", label: "Platform" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/research", label: "Research" },
    { href: "/alerts-safety", label: "Alerts & Safety" },
    { href: "/demo-lab", label: "Demo Lab" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(94,234,212,0.12)] bg-[rgba(7,11,14,0.85)] backdrop-blur-2xl transition-all">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo with exact SVG waves mark from index.html */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? "text-[#f0f7f6]" : "text-[#a4beba] hover:text-[#f0f7f6]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#5eead4] to-[#38bdf8] shadow-[0_0_8px_#5eead4]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/citizen">
            <Button variant="ghost" size="sm" className="text-xs text-[#a4beba] hover:text-white">
              Citizen View
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-[#5eead4]/30 bg-[#16232a]/60 text-[#5eead4] hover:bg-[#5eead4]/15 hover:border-[#5eead4]/60 flex items-center gap-1.5 shadow-[0_0_10px_rgba(94,234,212,0.1)]"
            >
              <Activity className="w-3.5 h-3.5" />
              Operations Portal
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="sm"
              className="text-xs font-bold bg-gradient-to-r from-[#5eead4] to-[#14b8a6] text-[#061110] hover:from-[#7cf0dd] hover:to-[#2dd4bf] shadow-[0_8px_25px_rgba(20,184,166,0.35)] flex items-center gap-1"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#2e4952] bg-[#0f171b] text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#2e4952] bg-[#070b0e]/95 px-5 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === link.href
                    ? "bg-[#5eead4]/15 text-[#5eead4] border border-[#5eead4]/30"
                    : "text-[#a4beba] hover:text-white hover:bg-[#142329]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#1c2e35] flex flex-col gap-2">
            <Link href="/citizen" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center">
                Citizen Portal
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center text-[#5eead4] border-[#5eead4]/30">
                Operations Portal
              </Button>
            </Link>
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full text-xs justify-center font-bold bg-gradient-to-r from-[#5eead4] to-[#14b8a6] text-[#061110]">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
