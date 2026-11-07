import React from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";

export const metadata = {
  title: "Citizen Portal | SURAKSHA",
  description: "Personalized river basin monitoring, local flood advisories, and emergency preparedness.",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-suraksha-950">
      <AppSidebar role="citizen" />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}

