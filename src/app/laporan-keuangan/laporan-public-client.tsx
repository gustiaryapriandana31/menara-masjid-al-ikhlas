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
          <span className="text-xs md:text-sm font-black tracking-tight uppercase">Menara Masjid Al-Ikhlas</span>
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

        {/* ── Seksi Donasi Material ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[10px] border-[2px] border-black bg-amber-100 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Package className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-neutral-800">Donasi Material / Barang</h2>
              <p className="text-[10px] text-neutral-500 font-medium">Sumbangan berupa material bangunan dari para donatur — tidak mempengaruhi saldo kas</p>
            </div>
          </div>

          {materialDonations.length > 0 ? (
            <div className="border-[2.5px] border-black rounded-[18px] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="divide-y-[1.5px] divide-neutral-200">
                {materialDonations.map((item, idx) => (
                  <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-amber-50/40 transition-colors">
                    <span className="shrink-0 h-7 w-7 flex items-center justify-center rounded-[8px] border-[1.5px] border-black bg-amber-100 text-[10px] font-black text-amber-800 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight">
                          {item.donorName}
                        </span>
                        <span className="shrink-0 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-400 bg-amber-50 text-amber-800 shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]">
                          Material
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-amber-700">
                        {item.materialName}
                        <span className="text-neutral-500 font-semibold ml-1.5">— {item.quantity}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[9px] text-neutral-400 font-semibold">
                        <span>{formatLocalDate(item.date)}</span>
                        {item.description && (
                          <span className="italic truncate max-w-[200px]">{item.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-[2.5px] border-dashed border-neutral-300 rounded-[18px] bg-white p-8 text-center">
              <Package className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 font-bold italic">Belum ada data donasi material yang tercatat.</p>
            </div>
          )}
        </div>

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
              <Link href="/donasi" className="text-emerald-800 hover:text-emerald-950 hover:underline">Konfirmasi Donasi</Link>
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
