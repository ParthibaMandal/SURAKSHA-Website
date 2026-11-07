"use client";

import React from "react";
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
  LifeBuoy,
  Home,
  LogOut,
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
  }[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const isAdmin = role === "admin";

  const adminGroups: NavGroup[] = [
    {
      label: "WORKSPACE",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutGrid },
        { href: "/admin/incidents", label: "Incidents", icon: Layers },
        { href: "/admin/forecasts", label: "Forecasts & risk", icon: Activity },
      ],
    },
    {
      label: "ANALYTICS GATES",
      items: [
        { href: "/admin/gates/pre-run", label: "Pre-Run gate", icon: Shield },
        { href: "/admin/gates/mid-run", label: "Mid-Run gate", icon: Activity },
        { href: "/admin/gates/post-run", label: "Post-Run gate", icon: CheckCircle2 },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { href: "/admin/stations", label: "Stations & sources", icon: MapPin },
        { href: "/admin/approvals", label: "Alerts & approval", icon: Bell },
        { href: "/admin/sos-queue", label: "SOS management", icon: AlertTriangle },
        { href: "/admin/sitrep", label: "SITREP reports", icon: FileText },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        { href: "/admin/audit", label: "Audit logs", icon: FileText },
        { href: "/admin/settings", label: "System settings", icon: Settings },
      ],
    },
  ];

  const citizenGroups: NavGroup[] = [
    {
      label: "MY SPACE",
      items: [
        { href: "/citizen", label: "Dashboard", icon: LayoutGrid },
        { href: "/citizen/locations", label: "My locations", icon: MapPin },
        { href: "/citizen/alerts", label: "My alerts", icon: Bell },
        { href: "/citizen/sos", label: "SOS assistance", icon: AlertTriangle },
      ],
    },
    {
      label: "SUPPORT",
      items: [
        { href: "/citizen/safety", label: "Safety centre", icon: Shield },
        { href: "/citizen/notifications", label: "Notifications", icon: Settings },
        { href: "/citizen/profile", label: "My profile", icon: Users },
      ],
    },
  ];

  const groups = isAdmin ? adminGroups : citizenGroups;

  return (
    <aside className="w-64 shrink-0 border-r border-[#2e4952]/40 bg-[#070b0e]/95 backdrop-blur-2xl flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="px-2 pt-1 pb-3 border-b border-[#1c2e35]">
          <BrandLogo size="sm" />
        </div>

        {/* Grouped Nav Items */}
        <div className="space-y-5">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold font-mono text-[#627b77] uppercase tracking-wider">
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#5eead4]/15 text-[#5eead4] border border-[#5eead4]/30 shadow-sm"
                        : "text-[#9bb2af] hover:text-white hover:bg-[#142329]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#5eead4]" : "text-[#627b77]"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Bottom Controls & User Chip */}
      <div className="pt-4 border-t border-[#1c2e35] space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#9bb2af] hover:text-white hover:bg-[#142329] transition-colors"
        >
          <Home className="w-4 h-4 text-[#627b77]" /> Public website
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#9bb2af] hover:text-white hover:bg-[#142329] transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#627b77]" /> Sign out
        </Link>

        {/* User Chip */}
        <div className="p-2.5 rounded-xl bg-[#0e1a1f] border border-[#2e4952]/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#163638] to-[#0e1d21] border border-[#5eead4]/40 grid place-items-center text-xs font-bold text-[#5eead4]">
            {isAdmin ? "AD" : "CU"}
          </div>
          <div className="overflow-hidden">
            <strong className="text-xs text-white block truncate">
              {isAdmin ? "Operations Admin" : "Citizen Preview"}
            </strong>
            <small className="text-[10px] text-[#627b77] block truncate">
              {isAdmin ? "Administrator preview" : "Citizen account"}
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
};
