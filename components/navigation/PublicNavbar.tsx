"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Menu, X, ChevronDown, ArrowRight, LayoutDashboard, MapPin, FlaskConical, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

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
    { href: "/platform", label: "Platform", hasDropdown: true },
    { href: "/research", label: "Research" },
    { href: "/docs", label: "Documentation" },
    { href: "/about", label: "About" },
  ];

  const portalHref =
    role === "admin" || role === "hydrologist" || role === "operator" ? "/admin" : "/citizen";
  const portalLabel =
    role === "admin" || role === "hydrologist" || role === "operator"
      ? "Operations Command"
      : "Citizen Portal";

  // Dynamic header styles: On homepage, seamlessly transparent with NO white border line; on scroll or inner pages, solid black
  const headerClass = isHome
    ? scrolled
      ? "fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md shadow-lg transition-all duration-300 border-b border-white/10"
      : "fixed top-0 inset-x-0 z-50 bg-transparent border-none transition-all duration-300"
    : "sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur-md transition-colors";

  return (
    <header className={headerClass}>
      <div className="w-full px-6 sm:px-10 lg:px-14 h-16 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Logo - Shield Mark + SURAKSHA on far left */}
        <BrandLogo />

        {/* Desktop Navigation Links - Centered */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {links.map((link) => {
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
                    className={`inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors cursor-pointer ${
                      isActive ? "text-white" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                        platformDropdownOpen ? "rotate-180 opacity-100 text-white" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {platformDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#0A0A0A] backdrop-blur-xl border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <Link
                        href="/platform"
                        onClick={() => setPlatformDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block group-hover:text-zinc-200 transition-colors">Platform Overview</span>
                          <span className="text-[11px] text-zinc-400">3D Basin simulation & reach models</span>
                        </div>
                      </Link>

                      <Link
                        href="/study-area"
                        onClick={() => setPlatformDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block group-hover:text-zinc-200 transition-colors">Catchment Study Area</span>
                          <span className="text-[11px] text-zinc-400">Middle Ganga reach stations</span>
                        </div>
                      </Link>

                      <Link
                        href="/demo-lab"
                        onClick={() => setPlatformDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <FlaskConical className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block group-hover:text-zinc-200 transition-colors">Simulation Lab</span>
                          <span className="text-[11px] text-zinc-400">Test scenarios & emergency alerts</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls - Auth State Aware */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={portalHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all shadow-sm"
              >
                <span>{portalLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white transition-all cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-white text-black font-mono font-bold text-[10px] grid place-items-center">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[100px] truncate text-xs font-medium">
                    {profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0A0A0A] backdrop-blur-xl border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="text-xs font-semibold text-white truncate">
                        {profile?.full_name || user.email}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-0.5">
                        ROLE: {profile?.role || "Citizen"}
                      </div>
                    </div>
                    <Link
                      href={portalHref}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 text-xs font-semibold text-white transition-all shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <Link
              href={portalHref}
              className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-medium text-white"
            >
              Workspace
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs text-white"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-white/15 bg-black/40 text-white hover:bg-black/60"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-xl px-6 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  pathname === link.href
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5"
            >
              Simulation Lab
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-semibold text-white">
                    {profile?.full_name || user.email}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    Role: {profile?.role || "Citizen"}
                  </div>
                </div>
                <Link href={portalHref} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-xs justify-center font-semibold bg-white text-black hover:bg-neutral-100 rounded-full shadow-lg">
                    {portalLabel} →
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 rounded-full border border-rose-500/20 bg-rose-500/10 text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/citizen" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs justify-center border-white/15 text-white rounded-full">
                    Citizen Portal
                  </Button>
                </Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs justify-center border-white/15 text-white rounded-full">
                    Operations Command Centre
                  </Button>
                </Link>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-xs justify-center font-semibold bg-white text-black hover:bg-neutral-100 rounded-full shadow-lg">
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
