import React from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { CommandTopBar } from "@/components/navigation/CommandTopBar";

export const metadata = {
  title: "Operations Command Centre | SURAKSHA",
  description: "Hydrological early warning command centre, supervisory gate verification, and telemetry oversight.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-[#000000] text-[#FFFFFF]">
      <AppSidebar role="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <CommandTopBar />
        <div className="flex-1 p-5 sm:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
