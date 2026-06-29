"use client"

import * as React from "react"
import { PlusCircle, MinusCircle, Home, FileText, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useNotifications } from "./notification-provider"

export function BottomNavbar() {
  const pathname = usePathname()
  const { pendingCount } = useNotifications()

  const navItems = [
    {
      title: "Laporan",
      url: "/admin/laporan-keuangan",
      icon: Home,
      activeBg: "bg-neutral-100 text-neutral-800 border-neutral-600",
      activeText: "text-neutral-800 font-bold",
    },
    {
      title: "Rincian",
      url: "/admin/rincian-dana",
      icon: FileText,
      activeBg: "bg-neutral-100 text-neutral-800 border-neutral-600",
      activeText: "text-neutral-800 font-bold",
    },
    {
      title: "Validasi",
      url: "/admin/validasi",
      icon: ShieldAlert,
      activeBg: "bg-blue-50 text-blue-600 border-blue-500",
      activeText: "text-blue-600 font-bold",
    },
    {
      title: "Pemasukan",
      url: "/admin/pemasukan",
      icon: PlusCircle,
      activeBg: "bg-blue-100 text-blue-600 border-blue-500",
      activeText: "text-blue-600 font-bold",
    },
    {
      title: "Pengeluaran",
      url: "/admin/pengeluaran",
      icon: MinusCircle,
      activeBg: "bg-red-100 text-red-600 border-red-500",
      activeText: "text-red-600 font-bold",
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 h-16 max-w-md mx-auto border-[2.5px] border-black bg-card rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex h-full items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          const Icon = item.icon

          return (
            <Link
              key={item.title}
              href={item.url}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-95"
            >
              <div
                className={cn(
                  "relative flex h-8 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-transparent transition-all",
                  isActive 
                    ? cn("border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", item.activeBg) 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                
                {/* Mobile badge count for validation pending */}
                {item.url === "/admin/validasi" && pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-black bg-red-500 px-1 text-[8px] font-black text-white shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className={cn("text-[8px] uppercase tracking-wider font-semibold text-center whitespace-nowrap", isActive ? item.activeText : "text-muted-foreground")}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
