import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeDateToIso(date: Date | string | null | undefined): string {
  if (!date) return ''
  try {
    const d = date instanceof Date ? date : new Date(date)
    return isNaN(d.getTime()) ? '' : d.toISOString()
  } catch {
    return ''
  }
}
