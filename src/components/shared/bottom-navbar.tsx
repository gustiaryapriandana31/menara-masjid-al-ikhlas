"use client"

import * as React from "react"
import { PlusCircle, MinusCircle, Home, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavbar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Laporan Keuangan",
      url: "/admin/laporan-keuangan",
      icon: Home,
      activeBg: "bg-neutral-100 text-neutral-800 border-neutral-600",
      activeText: "text-neutral-800 font-bold",
    },
    {
      title: "Rincian Dana",
      url: "/admin/rincian-dana",
      icon: FileText,
      activeBg: "bg-neutral-100 text-neutral-800 border-neutral-600",
      activeText: "text-neutral-800 font-bold",
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
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          const Icon = item.icon

          return (
            <Link
              key={item.title}
              href={item.url}
              className="flex flex-col items-center justify-center w-24 h-full gap-0.5 transition-all active:scale-95"
            >
              <div
                className={cn(
                  "flex h-8 w-14 items-center justify-center rounded-[12px] border-[1.5px] border-transparent transition-all",
                  isActive 
                    ? cn("border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", item.activeBg) 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn("text-[9px] uppercase tracking-wider font-medium", isActive ? item.activeText : "text-muted-foreground")}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
