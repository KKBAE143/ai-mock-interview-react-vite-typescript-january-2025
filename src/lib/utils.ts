import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculatePercentageChange(current: number, target: number) {
  return ((target - current) / current) * 100;
}

export function getExperienceLevel(years: number) {
  if (years < 2) return "Entry Level";
  if (years < 5) return "Mid Level";
  if (years < 8) return "Senior Level";
  if (years < 12) return "Lead Level";
  return "Executive Level";
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-IN").format(num);
}
