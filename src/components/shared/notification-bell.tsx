"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, BellOff, ShieldAlert, Check, X, ExternalLink } from "lucide-react"
import { useNotifications, PendingDonation } from "./notification-provider"
import { formatRupiah } from "@/lib/format"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { pendingCount, pendingList, permission, requestPermission } = useNotifications()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = (id: string) => {
    setIsOpen(false)
    router.push("/admin/validasi")
  }

  return (
    <div ref={containerRef} className="relative z-50">
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-[8px] border-[1.5px] border-black bg-white hover:bg-neutral-50 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer",
          isOpen && "bg-neutral-100 shadow-none translate-x-[0.5px] translate-y-[0.5px]"
        )}
        title="Notifikasi Donasi"
      >
        {permission === "granted" ? (
          <Bell className="h-4 w-4 text-yellow-500 fill-yellow-400" />
        ) : (
          <BellOff className="h-4 w-4 text-yellow-500" />
        )}
        
        {/* Badge Count */}
        {pendingCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-black bg-red-500 px-1 text-[8px] font-black text-white shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="fixed md:absolute top-16 md:top-auto right-4 md:left-0 md:right-auto left-4 mx-auto md:mx-0 w-auto md:w-80 max-w-[340px] md:max-w-none border-[2.5px] border-black bg-white rounded-[16px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="flex h-11 items-center justify-between border-b-[2px] border-black bg-[#faf8f5] px-3.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              🔔 Notifikasi Donasi
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 rounded-full border border-black bg-white flex items-center justify-center hover:bg-neutral-50 shadow-[0.5px_0.5px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3.5 space-y-3.5 max-h-[320px] overflow-y-auto">
            {/* System Notifications Action */}
            <div className="border-[1.5px] border-black rounded-[10px] p-2.5 bg-neutral-50 shadow-[1.5px_1.5px_0px_0px_#000]">
              {permission === "default" && (
                <div className="space-y-1.5 text-center">
                  <p className="text-[9px] font-bold text-neutral-600 leading-normal">
                    Terima pemberitahuan langsung di bilah notifikasi HP/Desktop saat ada donatur baru.
                  </p>
                  <button
                    onClick={requestPermission}
                    className="w-full py-1 text-center text-[9px] font-black uppercase rounded-[6px] border border-black bg-blue-100 hover:bg-blue-200 text-blue-900 shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
                  >
                    Aktifkan Notifikasi 🔔
                  </button>
                </div>
              )}
              {permission === "granted" && (
                <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Notifikasi Browser & OS Aktif</span>
                </div>
              )}
              {permission === "denied" && (
                <div className="flex items-center gap-2 text-[9px] font-bold text-red-800 bg-red-50 border border-red-200 rounded-md p-1.5">
                  <X className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Notifikasi diblokir. Harap aktifkan di pengaturan browser Anda.</span>
                </div>
              )}
            </div>

            {/* Notification List */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">
                Perlu Validasi ({pendingCount})
              </span>
              
              {pendingList.length > 0 ? (
                <div className="space-y-2 divide-y divide-neutral-100">
                  {pendingList.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        "pt-2 first:pt-0 group cursor-pointer block hover:bg-neutral-50/50 transition-colors",
                        "flex flex-col gap-1 text-left"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-[10px] text-neutral-800 uppercase tracking-tight truncate max-w-[150px] group-hover:text-blue-700 transition-colors">
                          {item.donorName}
                        </div>
                        <div className="text-[8px] font-black text-neutral-400 shrink-0">
                          {formatDistance(item.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-black text-red-700 tabular-nums">
                          Rp {formatRupiah(item.amount)}
                        </span>
                        <span className="inline-block text-[8px] font-bold uppercase px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded shadow-[0.5px_0.5px_0px_rgba(0,0,0,1)]">
                          {item.paymentChannel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 px-4 border border-dashed border-neutral-300 rounded-[10px] bg-neutral-50/50">
                  <p className="text-[10px] font-bold text-neutral-400 italic">
                    🎉 Semua donasi online telah divalidasi.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action Link */}
          {pendingCount > 0 && (
            <div className="border-t-[2px] border-black bg-neutral-50 p-2 text-center">
              <Link
                href="/admin/validasi"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-1 text-[9px] font-black uppercase text-blue-900 hover:text-blue-950"
              >
                Ke Halaman Validasi
                <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Simple format helper for "time ago" in Indonesian
function formatDistance(isoString: string): string {
  const d = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "baru saja"
  if (diffMins < 60) return `${diffMins}m lalu`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}jam lalu`
  
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}`
}
