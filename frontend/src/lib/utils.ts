import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// delay in milisecond
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
