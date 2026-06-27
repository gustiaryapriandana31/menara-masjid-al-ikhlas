"use client"

import * as React from "react"
import { useActionState } from "react"
import { ShieldAlert, User, Lock, ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction } from "./actions"
import Link from "next/link"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
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
      console.log("Petugas menyetujui pemasangan aplikasi")
    }
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo and Title Section */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] border-[3px] border-black bg-blue-50 shadow-[3px_3px_0px_0px_#2563eb] active:scale-95 transition-all hover:bg-blue-100">
            <span className="text-3xl">🕌</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tight text-neutral-800 leading-tight">
              Menara Al-Ikhlas
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Panel Akses Panitia
            </p>
          </div>
        </div>

        {/* Main Brutalist Form Container */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
          
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-black uppercase tracking-tight text-neutral-700">Masuk Akun</h2>
            <p className="text-[10px] text-muted-foreground font-medium">Masukkan username & password untuk mengelola kas</p>
          </div>

          {isInstallable && (
            <Button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 text-xs font-black uppercase border-[2.5px] border-black bg-emerald-400 hover:bg-emerald-500 text-black rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              📲 Pasang Aplikasi di HP Petugas
            </Button>
          )}

          <hr className="border-t-[2px] border-black" />

          {/* Form */}
          <form action={formAction} className="space-y-4">
            
            {/* Error Notification */}
            {state?.error && (
              <div className="flex items-center gap-2 rounded-[12px] border-[2px] border-black bg-red-100 p-3 text-xs text-red-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <span className="text-blue-600">◆</span> Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-neutral-400">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  disabled={isPending}
                  required
                  className="pl-10 pr-3 py-5 font-bold text-xs border-[2px] border-black rounded-[12px] bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <span className="text-blue-600">◆</span> Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-neutral-400">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  required
                  className="pl-10 pr-3 py-5 font-bold text-xs border-[2px] border-black rounded-[12px] bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 text-xs font-black uppercase border-[2.5px] border-black bg-blue-500 hover:bg-blue-600 text-white rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Panel</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-black bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1 text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] transition-all">
            ⬅ Kembali Ke Beranda
          </Link>
        </div>

      </div>
    </main>
  )
}
