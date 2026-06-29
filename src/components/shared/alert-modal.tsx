"use client"

import * as React from "react"
import { X, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertModalVariant = "error" | "success" | "warning" | "info"

interface AlertModalProps {
  open: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: AlertModalVariant
  /** Extra action button label (e.g. "Coba Lagi") */
  actionLabel?: string
  onAction?: () => void
}

const variantConfig: Record<AlertModalVariant, {
  icon: React.ReactNode
  bg: string
  border: string
  iconBg: string
  titleColor: string
  btnBg: string
}> = {
  error: {
    icon: <XCircle className="h-7 w-7 text-red-600" />,
    bg: "bg-red-50",
    border: "border-red-500",
    iconBg: "bg-red-100 border-red-400",
    titleColor: "text-red-800",
    btnBg: "bg-red-600 hover:bg-red-700 text-white",
  },
  success: {
    icon: <CheckCircle2 className="h-7 w-7 text-emerald-600" />,
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    iconBg: "bg-emerald-100 border-emerald-400",
    titleColor: "text-emerald-800",
    btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  warning: {
    icon: <AlertTriangle className="h-7 w-7 text-amber-600" />,
    bg: "bg-amber-50",
    border: "border-amber-500",
    iconBg: "bg-amber-100 border-amber-400",
    titleColor: "text-amber-900",
    btnBg: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  info: {
    icon: <Info className="h-7 w-7 text-blue-600" />,
    bg: "bg-blue-50",
    border: "border-blue-500",
    iconBg: "bg-blue-100 border-blue-400",
    titleColor: "text-blue-800",
    btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
  },
}

export function AlertModal({
  open,
  onClose,
  title,
  message,
  variant = "error",
  actionLabel,
  onAction,
}: AlertModalProps) {
  const cfg = variantConfig[variant]

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-[20px] border-[3px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
          "animate-in zoom-in-95 fade-in duration-200",
          cfg.bg,
          cfg.border,
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border-[1.5px] border-black bg-white p-1 text-neutral-700 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Icon */}
        <div className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-full border-[2px] mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]",
          cfg.iconBg,
        )}>
          {cfg.icon}
        </div>

        {/* Title */}
        <h3
          id="alert-modal-title"
          className={cn("mb-2 text-center text-sm font-black uppercase tracking-wide", cfg.titleColor)}
        >
          {title ?? (variant === "error" ? "Terjadi Kesalahan" :
            variant === "success" ? "Berhasil!" :
              variant === "warning" ? "Perhatian" : "Informasi")}
        </h3>

        {/* Message */}
        <p className="text-center text-xs font-medium text-neutral-700 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className={cn("mt-5 flex gap-2", actionLabel ? "flex-row" : "flex-col")}>
          {actionLabel && onAction && (
            <button
              onClick={() => { onAction(); onClose() }}
              className={cn(
                "flex-1 rounded-[10px] border-[2px] border-black py-2.5 text-[11px] font-black uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all",
                cfg.btnBg,
              )}
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-[10px] border-[2px] border-black bg-white py-2.5 text-[11px] font-black uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-neutral-800"
          >
            {actionLabel ? "Tutup" : "Mengerti"}
          </button>
        </div>
      </div>
    </div>
  )
}
