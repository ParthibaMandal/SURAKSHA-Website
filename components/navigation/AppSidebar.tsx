"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Layers,
  Activity,
  Shield,
  CheckCircle2,
  MapPin,
  Bell,
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Home,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";

interface AppSidebarProps {
  role: "citizen" | "admin";
}

interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("suraksha_auth");
      setIsAuthenticated(Boolean(auth));
    }
  }, []);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("suraksha_auth");
      setIsAuthenticated(false);
    }
    router.push("/auth/login");
  };

  const adminGroups: NavGroup[] = [
    {
      label: "COMMAND WORKSPACE",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutGrid },
        { href: "/admin/incidents", label: "Incidents", icon: Layers, badge: "02" },
        { href: "/admin/forecasts", label: "Forecasts & Risk", icon: Activity },
      ],
    },
    {
      label: "ANALYTICS GATES",
      items: [
        { href: "/admin/gates/pre-run", label: "Pre-Run Gate", icon: Shield },
        { href: "/admin/gates/mid-run", label: "Mid-Run Gate", icon: Activity },
        { href: "/admin/gates/post-run", label: "Post-Run Gate", icon: CheckCircle2 },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { href: "/admin/stations", label: "Stations & Sources", icon: MapPin, badge: "08" },
        { href: "/admin/approvals", label: "Alerts & Approval", icon: Bell, badge: "03" },
        { href: "/admin/sos-queue", label: "SOS Management", icon: AlertTriangle },
        { href: "/admin/sitrep", label: "SITREP Reports", icon: FileText },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        { href: "/admin/audit", label: "Audit Logs", icon: FileText },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
      ],
    },
  ];

  const citizenGroups: NavGroup[] = [
    {
      label: "CITIZEN PORTAL",
      items: [
        { href: "/citizen", label: "Personal Dashboard", icon: LayoutGrid },
        { href: "/citizen/locations", label: "Saved Locations", icon: MapPin, badge: "02" },
        { href: "/citizen/alerts", label: "Published Advisories", icon: Bell, badge: "01" },
        { href: "/citizen/sos", label: "SOS Assistance", icon: AlertTriangle },
      ],
    },
    {
      label: "PREPAREDNESS & SETTINGS",
      items: [
        { href: "/citizen/safety", label: "Preparedness Checklist", icon: Shield },
        { href: "/citizen/notifications", label: "Notification Preferences", icon: Settings },
        { href: "/citizen/profile", label: "My Profile", icon: Users },
      ],
    },
  ];

  const groups = isAdmin ? adminGroups : citizenGroups;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full text-white">
      <div className="space-y-6">
        {/* Clean Workspace Badge Header (Duplicate Brand Logo Removed) */}
        <div className="px-3 pt-2 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06b6d4]" />
            <span className="text-xs font-mono font-bold tracking-wider text-white uppercase whitespace-nowrap">
              {isAdmin ? "Operations Command" : "Citizen Safety Hub"}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#06B6D4]/15 text-[#38BDF8] border border-[#06B6D4]/30 whitespace-nowrap">
            {isAdmin ? "CMD · LIVE" : "PATNA REACH"}
          </span>
        </div>

        {/* Grouped Nav Items */}
        <div className="space-y-5">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#06B6D4]/15 text-white border border-[#06B6D4]/40 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#06B6D4]" : "text-slate-400"
                        }`}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap ${
                          isActive
                            ? "bg-[#06B6D4] text-[#090C10]"
                            : "bg-white/5 text-slate-400 border border-white/10"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Bottom Controls & User Chip */}
      <div className="pt-4 mt-6 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
        >
          <Home className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">Public Portal</span>
        </Link>

        {/* Authenticated Sign Out / Unauthenticated Sign In Toggle */}
        {isAuthenticated ? (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors whitespace-nowrap text-left"
          >
            <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="whitespace-nowrap">Sign Out</span>
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-[#06B6D4] hover:text-[#38BDF8] hover:bg-[#06B6D4]/10 transition-colors whitespace-nowrap"
          >
            <LogIn className="w-4 h-4 text-[#06B6D4] shrink-0" />
            <span className="whitespace-nowrap">Sign In →</span>
          </Link>
        )}

        {/* User Chip */}
        <div className="p-2.5 rounded-2xl bg-[#10161F]/80 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40 grid place-items-center text-xs font-mono font-bold text-[#06B6D4] shrink-0">
            {isAdmin ? "OP" : "CZ"}
          </div>
          <div className="overflow-hidden">
            <strong className="text-xs text-white block truncate whitespace-nowrap">
              {isAdmin ? "Duty Hydrologist" : "Citizen Account"}
            </strong>
            <small className="text-[10px] font-mono text-slate-400 block truncate whitespace-nowrap">
              {isAdmin ? "Ganga Basin Command" : "Patna Reach (Preview)"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger Bar (Uses workspace identifier without duplicate brand logo) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#090C10] text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06b6d4]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {isAdmin ? "Command Workspace" : "Citizen Portal"}
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-full border border-white/15 bg-white/5 text-white"
          aria-label="Toggle workspace navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <aside className="w-72 max-w-[85vw] bg-[#090C10] border-r border-white/10 p-4 overflow-y-auto">
            {sidebarContent}
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-[#090C10] flex-col justify-between p-4 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
};
