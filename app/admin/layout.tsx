import React from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";

export const metadata = {
  title: "Operations Portal | SURAKSHA",
  description: "Hydrological early warning control room, supervisory gate verification, and telemetry oversight.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-suraksha-950">
      <AppSidebar role="admin" />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}

