"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/horizon")) {
    return null;
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/platform", label: "Platform" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/research", label: "Research" },
    { href: "/alerts-safety", label: "Alerts & Safety" },
    { href: "/demo-lab", label: "Demo Lab" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1c2c34] bg-[#03090c]/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-xs font-medium transition-colors ${
                  isActive ? "text-[#f0f7f6]" : "text-[#9bb2af] hover:text-[#f0f7f6]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[#08a2be]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/citizen">
            <Button variant="ghost" size="sm" className="text-xs">
              Citizen View
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-[#1c2c34] text-[#9bb2af] hover:text-[#f0f7f6]"
            >
              Operations Portal
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="sm"
              className="text-xs font-semibold"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded border border-[#1c2c34] bg-[#071115] text-[#9bb2af] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1c2c34] bg-[#071115] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded text-xs font-medium ${
                  pathname === link.href
                    ? "bg-[#08a2be]/15 text-[#f0f7f6] border border-[#08a2be]/30"
                    : "text-[#9bb2af] hover:text-white hover:bg-[#0f1d24]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#1c2c34] flex flex-col gap-2">
            <Link href="/citizen" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center">
                Citizen Portal
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center">
                Operations Portal
              </Button>
            </Link>
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full text-xs justify-center font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
