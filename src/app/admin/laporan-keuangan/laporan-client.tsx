"use client"

import * as React from "react"
import { Wallet, TrendingUp, TrendingDown, Target, BarChart2, PieChart as PieIcon, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/format"
import { ProgressBar, PieChart, DonutChart, BarChart } from "@/components/dashboard/dashboard-charts"

interface LaporanClientProps {
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
}

export default function LaporanClient({
  totalCash,
  totalTransfer,
  totalExpense,
  expenseCategories,
  transferChannels,
  monthlyTrend,
  isAdmin = true
}: LaporanClientProps & { isAdmin?: boolean }) {
  // Hitung agregasi tambahan
  const totalIncome = totalCash + totalTransfer
  const currentBalance = totalIncome - totalExpense
  const targetDana = 400000000 // Target Rp 400 Juta

  // Helper untuk melabeli nama bank/saluran transfer
  const getChannelLabel = (key: string) => {
    switch (key) {
      case "SUMSEL_BABEL_SYARIAH": return "BSB Syariah"
      case "BSI": return "Bank BSI"
      case "MANDIRI": return "Bank Mandiri"
      case "BCA": return "Bank BCA"
      case "BRI": return "Bank BRI"
      case "BNI": return "Bank BNI"
      case "QRIS": return "QRIS (Scan)"
      case "OTHER": return "Lainnya"
      default: return key
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER UTAMA */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-emerald-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
          <BarChart2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Laporan Keuangan</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Analisis grafik dan transparansi dana pembangunan Menara Al-Ikhlas</p>
        </div>
      </div>

      {/* =============================================================
          1. STATISTIK RINGKASAN UTAMA (KPI CARDS - RESPONSIVE GRID)
          ============================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: SALDO KAS SAAT INI */}
        <Card className="bg-amber-50/70 border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#f59e0b] overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Saldo Kas Pembangunan</span>
            <Wallet className="h-4 w-4 text-amber-600 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-lg font-black text-neutral-900 tabular-nums">
              Rp {formatRupiah(currentBalance)}
            </div>
            <p className="text-[9px] text-amber-700 font-semibold mt-1">
              Saldo Kas Pembangunan Menara Saat ini
            </p>
          </CardContent>
        </Card>

        {/* CARD 2: TOTAL PEMASUKAN */}
        <Card className="bg-emerald-50/70 border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#10b981] overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Total Pemasukan</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-lg font-black text-neutral-900 tabular-nums">
              Rp {formatRupiah(totalIncome)}
            </div>
            <p className="text-[9px] text-emerald-700 font-semibold mt-1">
              Akumulasi Kas Masuk (Tunai + Online)
            </p>
          </CardContent>
        </Card>

        {/* CARD 3: TOTAL PENGELUARAN */}
        <Card className="bg-red-50/70 border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#ef4444] overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-800">Total Pengeluaran</span>
            <TrendingDown className="h-4 w-4 text-red-600 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-lg font-black text-neutral-900 tabular-nums">
              Rp {formatRupiah(totalExpense)}
            </div>
            <p className="text-[9px] text-red-700 font-semibold mt-1">
              Dana yang sudah dibelanjakan
            </p>
          </CardContent>
        </Card>

      </div>

      {/* =============================================================
          2. PROGRESS BAR: TARGET PEMBANGUNAN
          ============================================================= */}
      <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col md:flex-row md:items-center gap-5 justify-between">
        <div className="space-y-1 md:max-w-md">
          <h2 className="text-xs font-black uppercase text-neutral-800 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-emerald-600" /> Target Dana Pembangunan
          </h2>
          <p className="text-[10px] text-neutral-500 font-medium">
            Progres pencapaian dana terkumpul terhadap target awal pembangunan Menara Masjid Al-Ikhlas.
          </p>
        </div>
        <div className="flex-1">
          <ProgressBar current={totalIncome} target={targetDana} />
        </div>
      </Card>

      {/* =============================================================
          3. CHARTS SECTION (TATA LETAK RESPONSIF DESKTOP VS MOBILE)
          ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* BAR CHART: TREN BULANAN PEMASUKAN & PENGELUARAN (12 BULAN) */}
        <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden lg:col-span-8">
          <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/50">
            <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800">
              📊 Tren Transaksi Bulanan ({new Date().getFullYear()})
            </CardTitle>
            <CardDescription className="text-[10px] text-neutral-500 font-medium">
              Perbandingan nominal dana masuk vs belanja panitia di tiap bulan berjalan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <BarChart data={monthlyTrend} />
          </CardContent>
        </Card>

        {/* PIE CHART: SEBARAN PEMASUKAN (TUNAI VS TRANSFER) */}
        <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden lg:col-span-4 flex flex-col">
          <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/50">
            <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800">
              💳 Sumber Pemasukan Dana
            </CardTitle>
            <CardDescription className="text-[10px] text-neutral-500 font-medium">
              Perbandingan kontribusi donasi tunai vs transfer digital.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 space-y-4 flex-1">
            <PieChart cash={totalCash} transfer={totalTransfer} />

            {/* Rincian Saluran Transfer (Online) */}
            {totalTransfer > 0 && (
              <div className="w-full pt-4 border-t-[1.5px] border-black space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                  Rincian Saluran Transfer (Online):
                </h4>
                <div className="space-y-2 text-[10px] font-bold">
                  {Object.entries(transferChannels)
                    .filter(([_, val]) => val > 0)
                    .map(([key, val]) => {
                      const channelPercent = (val / totalTransfer) * 100
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-neutral-700">{getChannelLabel(key)}</span>
                            <span className="text-neutral-900 tabular-nums">
                              Rp {formatRupiah(val)} ({channelPercent.toFixed(1)}%)
                            </span>
                          </div>
                          {/* Mini loading bar Neobrutalist */}
                          <div className="w-full h-2 bg-neutral-100 border-[1.5px] border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            <div 
                              style={{ width: `${channelPercent}%` }}
                              className="h-full bg-violet-400 border-r-[1.5px] border-black"
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* DONUT CHART: SEBARAN PENGELUARAN KATEGORI */}
        <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden lg:col-span-6">
          <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/50">
            <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800">
              🛍️ Distribusi Pengeluaran Belanja
            </CardTitle>
            <CardDescription className="text-[10px] text-neutral-500 font-medium">
              Sebaran pemakaian dana berdasarkan pos/kategori kebutuhan material dan operasional.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-64">
            <DonutChart
              material={expenseCategories.MATERIAL}
              labor={expenseCategories.LABOR}
              operational={expenseCategories.OPERATIONAL}
              other={expenseCategories.OTHER}
            />
          </CardContent>
        </Card>

        {/* INFORMASI REKENING / CATATAN TRANSPARANSI */}
        <Card className="bg-[#fffbeb] border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-6 p-5 flex flex-col justify-center gap-4">
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-amber-200 border-[2.5px] border-black rounded-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
              <HelpCircle className="h-5 w-5 text-amber-800" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">Syiar Keuangan Transparan</h3>
              <p className="text-[10px] text-neutral-800 leading-normal font-bold">
                Seluruh grafik statistik di atas dihitung secara waktu-nyata (real-time) bersumber langsung dari database transaksi yang diinput oleh panitia dan donatur.
              </p>
            </div>
          </div>
          <hr className="border-t-[1.5px] border-black" />
          <div className="text-[10px] text-neutral-700 space-y-2 font-medium">
            <p>
              💡 **Tips Analisis**:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Arahkan kursor Anda ke masing-masing batang grafik bulanan untuk melihat rincian detail kas masuk & keluar bulan tersebut.</li>
              <li>Pastikan dana simpanan (saldo kas) selalu berada di zona positif untuk menjaga kestabilan upah tukang dan pembelian material menara.</li>
              <li>
                {isAdmin ? (
                  "Untuk rincian detil setiap item transaksi, silakan merujuk ke menu Rincian Dana di panel navigasi Anda."
                ) : (
                  "Setiap donasi online yang masuk memerlukan validasi dari bendahara pembangunan sebelum tercatat secara riil di grafik keuangan ini."
                )}
              </li>
            </ul>
          </div>
        </Card>

      </div>

    </div>
  )
}
