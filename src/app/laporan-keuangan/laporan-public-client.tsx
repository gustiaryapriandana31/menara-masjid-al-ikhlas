"use client"

import * as React from "react"
import { ArrowLeft, Info, Building, Phone, Package } from "lucide-react"
import Link from "next/link"
import LaporanClient from "@/app/admin/laporan-keuangan/laporan-client"

interface MaterialDonationItem {
  id: string
  donorName: string
  materialName: string
  quantity: string
  date: string | null
  description: string | null
}

interface LaporanPublicClientProps {
  totalCash: number
  totalTransfer: number
  totalExpense: number
  expenseCategories: {
    MATERIAL: number
    LABOR: number
    OPERATIONAL: number
    OTHER: number
  }
  transferChannels: {
    SUMSEL_BABEL_SYARIAH: number
    BSI: number
    MANDIRI: number
    BCA: number
    BRI: number
    BNI: number
    QRIS: number
    OTHER: number
  }
  monthlyTrend: {
    label: string
    income: number
    expense: number
  }[]
  materialDonations: MaterialDonationItem[]
  materialStats?: {
    totalTrans: number
    totalTypes: number
    totalDonors: number
    topMaterials?: { name: string; count: number }[]
    materialTypes?: {
      name: string
      count: number
      quantities: string[]
      totalQuantityDisplay?: string
      donorCount: number
    }[]
  }
}

function formatLocalDate(isoStr: string | null): string {
  if (!isoStr) return "-"
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return "-"
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

export default function LaporanPublicClient({
  totalCash,
  totalTransfer,
  totalExpense,
  expenseCategories,
  transferChannels,
  monthlyTrend,
  materialDonations,
  materialStats,
}: LaporanPublicClientProps) {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col font-sans">
      
      {/* Public Header */}
      <header className="sticky top-0 z-40 flex h-14 sm:h-16 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-3 sm:px-6 md:px-8 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 border-[1.5px] border-black bg-neutral-100 hover:bg-neutral-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] transition-all shrink-0"
        >
          <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="hidden xs:inline">Kembali ke Beranda</span>
          <span className="xs:hidden">Beranda</span>
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full border border-black object-cover shrink-0" />
          <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-tight uppercase truncate">Menara Al-Ikhlas</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 w-full max-w-5xl mx-auto space-y-6">
        
        {/* Banner Transparansi Publik */}
        <div className="w-full border-[2.5px] border-black rounded-[18px] sm:rounded-[22px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-4.5 sm:p-6 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-[120px] opacity-10 select-none"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Transparansi Keuangan
            </span>
          </div>
          <h1 className="text-base sm:text-lg md:text-2xl font-black tracking-tight">
            Laporan Keterbukaan Publik &amp; Audit Kas
          </h1>
          <p className="text-[10px] md:text-xs text-emerald-100/90 font-medium max-w-2xl mt-1.5 leading-relaxed">
            Selamat datang di portal transparansi pembangunan Menara Masjid Al-Ikhlas. Semua sumbangan donatur (tunai/transfer) serta realisasi belanja material dilaporkan secara jujur, akurat, dan dapat diaudit secara terbuka.
          </p>
        </div>

        {/* Financial Dashboard */}
        <LaporanClient
          totalCash={totalCash}
          totalTransfer={totalTransfer}
          totalExpense={totalExpense}
          expenseCategories={expenseCategories}
          transferChannels={transferChannels}
          monthlyTrend={monthlyTrend}
          materialStats={materialStats}
          isAdmin={false}
        />

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-[2.5px] border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full border-[1.5px] border-black object-cover" />
              <span className="text-base font-black tracking-tight uppercase text-neutral-800">Masjid Al-Ikhlas</span>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
              Sistem pencatatan kas pembangunan Menara Masjid Al-Ikhlas secara terbuka dan akuntabel. Setiap infaq yang masuk menjadi saksi jariyah Anda di akhirat kelak.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Hubungi Kami</h4>
            <div className="space-y-2 text-[11px] font-semibold text-neutral-700">
              <p className="flex items-start gap-2">
                <Building className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>Masjid Al-Ikhlas, Dusun I Meranjat II, Kecamatan Indralaya Selatan, Kabupaten Ogan Ilir, Sumatera Selatan.</span>
              </p>
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>NMID: ID1021065841954</span>
              </p>
              <a href="https://wa.me/6281377884175" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline transition-all">
                <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>WA: 0813-7788-4175</span>
              </a>
              <a href="https://web.facebook.com/masjid.alikhlas.338" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline transition-all">
                <svg className="h-4 w-4 shrink-0 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span>FB: Masjid Al-Ikhlas</span>
              </a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Menu Navigasi</h4>
            <div className="flex flex-col gap-2 text-[11px] font-black uppercase">
              <Link href="/" className="text-emerald-800 hover:text-emerald-950 hover:underline">Beranda Utama</Link>
              <Link href="/#donasi" className="text-emerald-800 hover:text-emerald-950 hover:underline">Cara Donasi</Link>
              <Link href="/laporan-keuangan" className="text-emerald-800 hover:text-emerald-950 hover:underline">Laporan Keuangan</Link>
            </div>
          </div>
        </div>
        <div className="border-t-[2px] border-black bg-neutral-50 py-4 text-center text-[10px] font-bold text-neutral-500 px-4">
          © {new Date().getFullYear()} Panitia Pembangunan Masjid Al-Ikhlas. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>

    </div>
  )
}
