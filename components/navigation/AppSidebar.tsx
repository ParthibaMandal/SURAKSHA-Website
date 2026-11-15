"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
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
  const isAdmin = role === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="px-2 pt-1 pb-4 border-b border-[#D8CBB3]/14 flex items-center justify-between">
          <BrandLogo size="sm" />
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
            {isAdmin ? "CMD" : "CITIZEN"}
          </span>
        </div>

        {/* Grouped Nav Items */}
        <div className="space-y-5">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold font-mono text-[#7D7465] uppercase tracking-widest">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#2F6BFF]/15 text-[#EDE4D3] border border-[#2F6BFF]/40 shadow-sm"
                        : "text-[#A69B88] hover:text-[#D8CBB3] hover:bg-[#292925] border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#2F6BFF]" : "text-[#7D7465]"
                        }`}
                      />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          isActive
                            ? "bg-[#2F6BFF] text-white"
                            : "bg-[#292925] text-[#A69B88] border border-[#D8CBB3]/14"
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
      <div className="pt-4 mt-6 border-t border-[#D8CBB3]/14 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#A69B88] hover:text-[#D8CBB3] hover:bg-[#292925] transition-colors"
        >
          <Home className="w-4 h-4 text-[#7D7465]" /> Public Website
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#A69B88] hover:text-[#D8CBB3] hover:bg-[#292925] transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#7D7465]" /> Sign Out
        </Link>

        {/* User Chip */}
        <div className="p-2.5 rounded-xl bg-[#292925] border border-[#D8CBB3]/15 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2F6BFF]/18 border border-[#2F6BFF]/40 grid place-items-center text-xs font-mono font-bold text-[#2F6BFF]">
            {isAdmin ? "OP" : "CZ"}
          </div>
          <div className="overflow-hidden">
            <strong className="text-xs text-[#D8CBB3] block truncate">
              {isAdmin ? "Duty Hydrologist" : "Citizen Account"}
            </strong>
            <small className="text-[10px] font-mono text-[#A69B88] block truncate">
              {isAdmin ? "Ganga Basin Command" : "Patna Reach (Preview)"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#D8CBB3]/14 bg-[#1E1E1C]">
        <BrandLogo size="sm" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3]"
          aria-label="Toggle workspace navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 flex">
          <aside className="w-72 max-w-[85vw] bg-[#1E1E1C] border-r border-[#D8CBB3]/18 p-4 overflow-y-auto">
            {sidebarContent}
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[#D8CBB3]/14 bg-[#1E1E1C] flex-col justify-between p-4 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
};
