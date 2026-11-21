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
    { href: "/platform", label: "Platform" },
    { href: "/docs", label: "Docs" },
    { href: "/how-it-works", label: "Capabilities" },
    { href: "/study-area", label: "Study Area" },
    { href: "/research", label: "Research" },
    { href: "/demo-lab", label: "Demo Lab" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D8CBB3]/15 bg-[#1E1E1C]/95 backdrop-blur-md transition-colors">
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
                className={`relative py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? "text-[#EDE4D3]"
                    : "text-[#A69B88] hover:text-[#D8CBB3]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-[#2F6BFF]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link href="/citizen">
            <Button variant="ghost" size="sm" className="text-xs">
              Citizen Portal
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="text-xs">
              Command Centre
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="sm" className="text-xs font-semibold bg-[#2F6BFF] text-white hover:bg-[#4B80FF]">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3] hover:text-[#EDE4D3]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D8CBB3]/15 bg-[#292925] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === link.href
                    ? "bg-[#2F6BFF]/15 text-[#EDE4D3] border border-[#2F6BFF]/40"
                    : "text-[#A69B88] hover:text-[#D8CBB3] hover:bg-[#33332E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#D8CBB3]/15 flex flex-col gap-2">
            <Link href="/citizen" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center">
                Citizen Portal
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs justify-center">
                Operations Command Centre
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
