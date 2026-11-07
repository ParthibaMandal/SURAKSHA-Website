import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStage(meters: number): string {
  return `${meters.toFixed(2)} m`;
}

export function getAlertColor(status: string) {
  switch (status.toLowerCase()) {
    case "danger":
    case "warning level 3":
    case "critical":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    case "warning":
    case "warning level 2":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    case "advisory":
    case "warning level 1":
      return "text-sky-400 border-sky-500/30 bg-sky-500/10";
    default:
      return "text-teal-400 border-teal-500/30 bg-teal-500/10";
  }
}

