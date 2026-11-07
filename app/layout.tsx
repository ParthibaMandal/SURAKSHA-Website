import type { Metadata } from "next";
import "./globals.css";
import { PublicNavbar } from "@/components/navigation/PublicNavbar";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export const metadata: Metadata = {
  title: "SURAKSHA | AI Hydrological Intelligence & Flood Decision Support",
  description:
    "AI-assisted hydrological intelligence and flood decision support platform connecting physical modeling, telemetry observations, and supervisory verification.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-suraksha-950 text-slate-100 flex flex-col min-h-screen selection:bg-cyan-500/30 selection:text-cyan-glow">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </body>
    </html>
  );
}

