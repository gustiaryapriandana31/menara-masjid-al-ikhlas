"use client"

import * as React from "react"
import { BarChart2, FileText, ArrowLeft, Heart, Info, Globe, Building, Phone } from "lucide-react"
import Link from "next/link"
import LaporanClient from "@/app/admin/laporan-keuangan/laporan-client"
import RincianDanaClient from "@/app/admin/rincian-dana/rincian-dana-client"
import { cn } from "@/lib/utils"

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
  incomes: any[]
  outcomes: any[]
}

export default function LaporanPublicClient({
  totalCash,
  totalTransfer,
  totalExpense,
  expenseCategories,
  transferChannels,
  monthlyTrend,
  incomes,
  outcomes
}: LaporanPublicClientProps) {
  // Tabs: 'charts' (Grafik) or 'details' (Rincian Transaksi)
  const [activeTab, setActiveTab] = React.useState<"charts" | "details">("charts")

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col font-sans">
      
      {/* Public Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-4 md:px-8 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 border-[1.5px] border-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full border border-black object-cover" />
          <span className="text-xs md:text-sm font-black tracking-tight uppercase">Menara Al-Ikhlas</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6">
        
        {/* Banner Transparansi Publik */}
        <div className="w-full border-[2.5px] border-black rounded-[22px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-[120px] opacity-10 select-none"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-emerald-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Transparansi Keuangan
            </span>
          </div>
          <h1 className="text-lg md:text-2xl font-black tracking-tight">
            Laporan Keterbukaan Publik & Audit Kas
          </h1>
          <p className="text-[10px] md:text-xs text-emerald-100/90 font-medium max-w-2xl mt-1.5 leading-relaxed">
            Selamat datang di portal transparansi pembangunan Menara Masjid Al-Ikhlas. Semua sumbangan donatur (luring/daring) serta realisasi belanja material dilaporkan secara jujur, akurat, dan dapat diaudit secara terbuka.
          </p>
        </div>

        {/* Tab Switcher - Brutalist Style */}
        <div className="flex border-[2.5px] border-black rounded-[18px] bg-white overflow-hidden p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab("charts")}
            className={cn(
              "flex-1 py-3 text-center text-xs md:text-sm font-black uppercase rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer",
              activeTab === "charts"
                ? "bg-emerald-100 text-emerald-800 border-[2.5px] border-black shadow-[2px_2px_0px_0px_#000]"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            )}
          >
            <BarChart2 className="h-4.5 w-4.5 shrink-0" />
            Ringkasan & Grafik
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "flex-1 py-3 text-center text-xs md:text-sm font-black uppercase rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer",
              activeTab === "details"
                ? "bg-emerald-100 text-emerald-800 border-[2.5px] border-black shadow-[2px_2px_0px_0px_#000]"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            )}
          >
            <FileText className="h-4.5 w-4.5 shrink-0" />
            Rincian Transaksi
          </button>
        </div>

        {/* Render Tab Content */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-4 md:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          {activeTab === "charts" ? (
            <LaporanClient
              totalCash={totalCash}
              totalTransfer={totalTransfer}
              totalExpense={totalExpense}
              expenseCategories={expenseCategories}
              transferChannels={transferChannels}
              monthlyTrend={monthlyTrend}
              isAdmin={false} // Hide admin tips
            />
          ) : (
            <RincianDanaClient
              incomes={incomes}
              outcomes={outcomes}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-[2.5px] border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Branding & Description */}
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

          {/* Col 2: Alamat & Kontak */}
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
              <a 
                href="https://wa.me/6281377884175" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-emerald-850 hover:underline transition-all"
              >
                <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>WA: 0813-7788-4175</span>
              </a>
              <a 
                href="https://web.facebook.com/masjid.alikhlas.338" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-emerald-850 hover:underline transition-all"
              >
                <svg className="h-4 w-4 shrink-0 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span>FB: Masjid Al-Ikhlas</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Menu Navigasi</h4>
            <div className="flex flex-col gap-2 text-[11px] font-black uppercase">
              <Link href="/" className="text-emerald-800 hover:text-emerald-950 hover:underline">
                Beranda Utama
              </Link>
              <Link href="/donasi" className="text-emerald-800 hover:text-emerald-950 hover:underline">
                Konfirmasi Donasi
              </Link>
              <Link href="/laporan-keuangan" className="text-emerald-800 hover:text-emerald-950 hover:underline">
                Laporan Keuangan
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t-[2px] border-black bg-neutral-50 py-4 text-center text-[10px] font-bold text-neutral-500 px-4">
          © {new Date().getFullYear()} Panitia Pembangunan Masjid Al-Ikhlas. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>

    </div>
  )
}
