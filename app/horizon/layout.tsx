import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizon — Minimalist Design in the Modern Era",
  description:
    "Master the art of minimalist design. A comprehensive course and studio curriculum exploring spatial architecture, purposeful reduction, and the grammar of negative space.",
};

export default function HorizonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

