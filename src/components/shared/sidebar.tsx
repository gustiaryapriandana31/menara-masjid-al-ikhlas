"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, MinusCircle, Home, FileText, LogOut, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/login/actions"

export function Sidebar() {
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
      title: "Validasi Donasi",
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
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r-[2.5px] border-black bg-white min-h-screen p-6 sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpg" alt="Logo" className="h-9 w-9 rounded-full border-[1.5px] border-black object-cover" />
        <div className="flex flex-col">
          <span className="text-sm font-black uppercase tracking-tight leading-tight">Panel Panitia</span>
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest leading-none">Menara Al-Ikhlas</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          const Icon = item.icon

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-xs font-black uppercase border-[2px] border-transparent rounded-[12px] transition-all hover:bg-neutral-50 active:scale-98",
                isActive
                  ? cn("border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", item.activeBg)
                  : "text-neutral-600"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Footer */}
      <div className="pt-6 border-t-[1.5px] border-black">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black uppercase border-[2px] border-black bg-red-50 hover:bg-red-100 text-red-700 rounded-[12px] shadow-[2.5px_2.5px_0px_0px_#ef4444] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_0px_#ef4444] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#ef4444] transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Keluar Panel</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
