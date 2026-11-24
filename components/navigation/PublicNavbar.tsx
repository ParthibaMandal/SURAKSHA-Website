"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  LayoutDashboard,
  MapPin,
  FlaskConical,
  BookOpen,
  Info,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/horizon")) {
    return null;
  }

  const links = [
    { href: "/platform", label: "Platform", hasDropdown: true, icon: LayoutDashboard },
    { href: "/research", label: "Research", icon: FlaskConical },
    { href: "/docs", label: "Documentation", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
  ];

  const portalHref =
    role === "admin" || role === "hydrologist" || role === "operator" ? "/admin" : "/citizen";
  const portalLabel =
    role === "admin" || role === "hydrologist" || role === "operator"
      ? "Operations Command"
      : "Citizen Portal";

  const headerClass = isHome
    ? scrolled
      ? "fixed top-0 inset-x-0 z-50 bg-[#110805]/95 backdrop-blur-md transition-all duration-300 border-b border-[#A0522D]/40"
      : "fixed top-0 inset-x-0 z-50 bg-transparent border-none transition-all duration-300"
    : "sticky top-0 z-50 w-full border-b border-[#A0522D]/40 bg-[#110805]/95 backdrop-blur-md transition-colors";

  return (
    <header className={headerClass}>
      <div className="w-full px-6 sm:px-10 lg:px-14 h-16 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Logo - Shield Mark + SURAKSHA on far left */}
        <BrandLogo />

        {/* Desktop Navigation Links - Animated Burnt Sienna Glassmorphic Pill Dock */}
        <nav
          className="hidden md:flex items-center gap-2.5 p-1.5 rounded-full nav-glass-dock"
          aria-label="Main Navigation"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.hasDropdown &&
                (pathname.startsWith("/platform") ||
                  pathname.startsWith("/study-area") ||
                  pathname.startsWith("/demo-lab")));

            if (link.hasDropdown) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setPlatformDropdownOpen(true)}
                  onMouseLeave={() => setPlatformDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                    aria-expanded={platformDropdownOpen}
                    className={`nav-glass-pill group text-xs font-semibold cursor-pointer ${
                      isActive ? "active text-[#F5F5DC]" : "text-[#F5F5DC]/85 hover:text-[#F5F5DC]"
                    }`}
                  >
                    <span className="icon-glass w-6 h-6 rounded-full">
                      <Icon className="w-3.5 h-3.5 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110" />
                    </span>
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      className={`relative z-10 w-3.5 h-3.5 text-[#F4A460] transition-transform duration-300 ${
                        platformDropdownOpen ? "rotate-180 text-[#F5F5DC]" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu - Burnt Sienna Elevated Surface */}
                  <AnimatePresence>
                    {platformDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2.5 w-68 rounded-2xl bg-[#1A0D09]/95 backdrop-blur-2xl border border-[#A0522D]/50 p-2 shadow-2xl z-50"
                      >
                        <Link
                          href="/platform"
                          onClick={() => setPlatformDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#A0522D]/20 transition-colors text-xs group"
                        >
                          <div className="icon-glass w-8 h-8 rounded-lg text-[#F5F5DC] shrink-0 mt-0.5">
                            <LayoutDashboard className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#F5F5DC] block group-hover:text-[#F4A460] transition-colors">
                              Platform Overview
                            </span>
                            <span className="text-[11px] text-[#F5F5DC]/65">
                              3D Basin simulation & reach models
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/study-area"
                          onClick={() => setPlatformDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#A0522D]/20 transition-colors text-xs group"
                        >
                          <div className="icon-glass w-8 h-8 rounded-lg text-[#F5F5DC] shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#F5F5DC] block group-hover:text-[#F4A460] transition-colors">
                              Catchment Study Area
                            </span>
                            <span className="text-[11px] text-[#F5F5DC]/65">
                              Middle Ganga reach stations
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/demo-lab"
                          onClick={() => setPlatformDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#A0522D]/20 transition-colors text-xs group"
                        >
                          <div className="icon-glass w-8 h-8 rounded-lg text-[#F5F5DC] shrink-0 mt-0.5">
                            <FlaskConical className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#F5F5DC] block group-hover:text-[#F4A460] transition-colors">
                              Simulation Lab
                            </span>
                            <span className="text-[11px] text-[#F5F5DC]/65">
                              Test scenarios & emergency alerts
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-glass-pill group text-xs font-semibold ${
                  isActive ? "active text-[#F5F5DC]" : "text-[#F5F5DC]/85 hover:text-[#F5F5DC]"
                }`}
              >
                <span className="icon-glass w-6 h-6 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls - Auth State Aware */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={portalHref}
                className="btn-glass-primary px-4 py-2 text-xs font-semibold text-[#F5F5DC] group"
              >
                <span className="relative z-10">{portalLabel}</span>
                <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#A0522D]/50 bg-[#1A0D09] hover:border-[#F4A460] text-xs text-[#F5F5DC] transition-all cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-[#E35336] text-[#F5F5DC] font-bold text-[10px] grid place-items-center">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[100px] truncate text-xs font-medium">
                    {profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#F4A460]" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1A0D09]/95 backdrop-blur-xl border border-[#A0522D]/50 p-1.5 shadow-2xl z-50"
                    >
                      <div className="px-3 py-2 border-b border-[#A0522D]/30 mb-1">
                        <div className="text-xs font-semibold text-[#F5F5DC] truncate">
                          {profile?.full_name || user.email}
                        </div>
                        <div className="text-[10px] text-[#F4A460] uppercase tracking-wider mt-0.5">
                          ROLE: {profile?.role || "Citizen"}
                        </div>
                      </div>
                      <Link
                        href={portalHref}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded text-xs text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:bg-[#A0522D]/20 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#F4A460]" />
                        <span>Open Workspace</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-[#E35336] hover:text-[#F4A460] hover:bg-[#E35336]/15 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn-glass-primary px-5 py-2 text-xs font-semibold text-[#F5F5DC] group"
            >
              <span className="relative z-10">Sign In</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link
              href={portalHref}
              className="btn-glass-primary px-3.5 py-1.5 text-xs font-medium text-[#F5F5DC]"
            >
              Workspace
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="btn-glass-primary px-3.5 py-1.5 text-xs text-[#F5F5DC]"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-[#A0522D]/50 bg-[#1A0D09] text-[#F5F5DC] hover:bg-[#24120C]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#A0522D]/40 bg-[#1A0D09]/95 backdrop-blur-xl px-6 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  pathname === link.href
                    ? "bg-[#E35336]/20 text-[#F4A460] font-semibold border border-[#E35336]/40"
                    : "text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:bg-[#A0522D]/15"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:bg-[#A0522D]/15"
            >
              Simulation Lab
            </Link>
          </div>

          <div className="pt-4 border-t border-[#A0522D]/30 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-md bg-[#24120C] border border-[#A0522D]/40">
                  <div className="text-xs font-semibold text-[#F5F5DC]">
                    {profile?.full_name || user.email}
                  </div>
                  <div className="text-[10px] font-mono text-[#F4A460] uppercase">
                    Role: {profile?.role || "Citizen"}
                  </div>
                </div>
                <Link href={portalHref} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-xs justify-center font-semibold">
                    {portalLabel} →
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full py-2 text-xs text-[#E35336] hover:text-[#F4A460] rounded-md border border-[#E35336]/30 bg-[#E35336]/10 text-center cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
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
                    Sign In →
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
