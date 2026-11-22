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
import { useAuth } from "@/lib/supabase/auth-context";

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
  const { user, profile, signOut } = useAuth();
  const isAdmin = role === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = Boolean(user);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    router.push("/auth/login");
  };

  const adminGroups: NavGroup[] = [
    {
      label: "OPERATIONS",
      items: [
        { href: "/admin", label: "Command Overview", icon: LayoutGrid },
        { href: "/admin/scenarios", label: "Model Scenarios", icon: Layers, badge: "3 Runs" },
        { href: "/admin/verification", label: "Supervisory Gates", icon: Shield, badge: "3/3 OK" },
        { href: "/admin/alerts", label: "CAP Protocol Dispatch", icon: Bell },
      ],
    },
    {
      label: "TELEMETRY & BASIN",
      items: [
        { href: "/admin/stations", label: "Station Registry", icon: MapPin },
        { href: "/admin/verification/ensemble", label: "Gauge Ensembles", icon: Activity },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        { href: "/admin/audit", label: "Operational Audit", icon: FileText },
        { href: "/admin/users", label: "Operators & Personnel", icon: Users },
        { href: "/admin/settings", label: "Command Settings", icon: Settings },
      ],
    },
  ];

  const citizenGroups: NavGroup[] = [
    {
      label: "CITIZEN PORTAL",
      items: [
        { href: "/citizen", label: "Flood Risk Status", icon: LayoutGrid },
        { href: "/citizen/alerts", label: "Local Flood Alerts", icon: AlertTriangle, badge: "Live" },
        { href: "/citizen/safety", label: "Emergency Checklist", icon: CheckCircle2 },
        { href: "/citizen/contact", label: "Emergency Helplines", icon: Users },
      ],
    },
    {
      label: "RESOURCES",
      items: [
        { href: "/docs", label: "Documentation", icon: FileText },
        { href: "/study-area", label: "Middle Ganga Reach Map", icon: MapPin },
      ],
    },
  ];

  const groups = isAdmin ? adminGroups : citizenGroups;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full text-white">
      <div className="space-y-6">
        {/* Clean Workspace Badge Header */}
        <div className="px-3 pt-2 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-xs font-mono font-semibold tracking-wider text-white uppercase whitespace-nowrap">
              {isAdmin ? "Operations Command" : "Citizen Safety Hub"}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/10 whitespace-nowrap">
            {isAdmin ? "CMD · LIVE" : "PATNA REACH"}
          </span>
        </div>

        {/* Grouped Nav Items */}
        <div className="space-y-5">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono text-zinc-500 uppercase tracking-widest whitespace-nowrap">
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
                        ? "bg-white/10 text-white border border-white/20 shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-zinc-500"
                        }`}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap ${
                          isActive
                            ? "bg-white text-black"
                            : "bg-white/5 text-zinc-400 border border-white/10"
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
          className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
        >
          <Home className="w-4 h-4 text-zinc-500 shrink-0" />
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
            className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            <LogIn className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="whitespace-nowrap">Sign In →</span>
          </Link>
        )}

        {/* User Chip */}
        <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 grid place-items-center text-xs font-mono font-bold text-white shrink-0">
            {profile?.role === "admin" || profile?.role === "hydrologist" || profile?.role === "operator" ? "OP" : "CZ"}
          </div>
          <div className="overflow-hidden">
            <strong className="text-xs text-white block truncate whitespace-nowrap">
              {profile?.full_name || (isAdmin ? "Duty Hydrologist" : "Citizen Account")}
            </strong>
            <small className="text-[10px] font-mono text-zinc-500 block truncate whitespace-nowrap">
              {profile?.email || (isAdmin ? "Ganga Basin Command" : "Patna Reach (Preview)")}
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
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
        <div className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex">
          <aside className="w-72 max-w-[85vw] bg-black border-r border-white/10 p-4 overflow-y-auto">
            {sidebarContent}
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-black flex-col justify-between p-4 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
};
