"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export default function AdminInstallButton({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isInstallable, setIsInstallable] = React.useState(false)

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      console.log("Petugas menyetujui pemasangan aplikasi kas")
    }
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable) return null

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className={cn(
        "flex items-center justify-center gap-2 w-full px-3.5 py-3 text-xs font-black uppercase border-[2.5px] border-black bg-amber-300 hover:bg-amber-400 text-black rounded-[12px] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.jpg" alt="Logo" className="h-4 w-4 rounded-full border border-black object-cover shrink-0" />
      <span>Pasang Aplikasi HP</span>
    </button>
  )
}
