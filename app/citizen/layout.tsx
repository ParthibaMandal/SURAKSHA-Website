import React from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { CommandTopBar } from "@/components/navigation/CommandTopBar";

export const metadata = {
  title: "Citizen Flood-Safety Dashboard | SURAKSHA",
  description: "Personalized river basin monitoring, human-approved flood advisories, and emergency preparedness.",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="workspace-shell flex min-h-[calc(100vh-4rem)] bg-[var(--background)] text-[var(--foreground)]">
      <AppSidebar role="citizen" />
      <div className="flex-1 flex flex-col min-w-0">
        <CommandTopBar workspace="CITIZEN" />
        <div className="flex-1 p-5 sm:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
