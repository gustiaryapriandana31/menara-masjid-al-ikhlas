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

/**
 * Format date string or Date object into DD/MM/YYYY (tanggal dulu baru bulan).
 */
export function formatLocalDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '-'
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (isNaN(d.getTime())) return '-'
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return '-'
  }
}

/**
 * Format date string or Date object into YYYY-MM-DD in local timezone for <input type="date" />.
 */
export function toLocalDateInputValue(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return ''
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (isNaN(d.getTime())) return ''
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

/**
 * Compare function to sort income items:
 * 1. Date DESC (tanggal terbaru)
 * 2. Named donors first (bukan Hamba Allah)
 * 3. Proof of transfer / receipt exists first
 */
export function compareIncomes<T extends { donorName?: string; date?: string | Date | null; receiptUrls?: string[]; donationConfirmationId?: string | null }>(a: T, b: T): number {
  const timeA = a.date ? new Date(a.date).getTime() : 0
  const timeB = b.date ? new Date(b.date).getTime() : 0
  if (timeB !== timeA) {
    return timeB - timeA
  }

  const nameA = (a.donorName || "").trim().toLowerCase()
  const nameB = (b.donorName || "").trim().toLowerCase()
  const isAnonA = !nameA || nameA === "hamba allah"
  const isAnonB = !nameB || nameB === "hamba allah"
  if (isAnonA !== isAnonB) {
    return isAnonA ? 1 : -1
  }

  const hasProofA = (a.receiptUrls && a.receiptUrls.length > 0) || !!a.donationConfirmationId
  const hasProofB = (b.receiptUrls && b.receiptUrls.length > 0) || !!b.donationConfirmationId
  if (hasProofA !== hasProofB) {
    return hasProofA ? -1 : 1
  }

  return 0
}


