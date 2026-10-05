"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { formatRupiah } from "@/lib/format"

// ==========================================
// 1. COMPONENT: PROGRESS BAR (TARGET DANA)
// ==========================================
interface ProgressBarProps {
  current: number
  target: number
  className?: string
}

export function ProgressBar({ current, target, className }: ProgressBarProps) {
  // Hitung persentase progres. Maksimal 100% untuk visual bar.
  const percent = target > 0 ? (current / target) * 100 : 0
  const visualPercent = Math.min(percent, 100)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs font-black uppercase tracking-wide">
        <span className="text-emerald-800">Progres Pengumpulan</span>
        <span className="text-neutral-700">{percent.toFixed(1)}%</span>
      </div>
      
      {/* Container Bar Neobrutalist (Garis tebal & bayangan tebal) */}
      <div className="relative w-full h-7 border-[2.5px] border-black bg-neutral-100 rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {/* Fill Bar (Warna hijau mencolok khas pembangunan) */}
        <div
          style={{ width: `${visualPercent}%` }}
          className="h-full bg-emerald-400 border-r-[2.5px] border-black transition-all duration-700 ease-out-back pattern-stripes"
        />
        
        {/* Teks Posisi Nilai Riil di Tengah Bar */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-neutral-800 pointer-events-none drop-shadow-[0.5px_0.5px_0px_rgba(255,255,255,1)]">
          Rp {formatRupiah(current)} / Rp {formatRupiah(target)}
        </div>
      </div>
    </div>
  )
}


// ==========================================
// 2. COMPONENT: PIE CHART (TUNAI VS TRANSFER)
// ==========================================
interface PieChartProps {
  cash: number
  transfer: number
}

export function PieChart({ cash, transfer }: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = React.useState<"CASH" | "TRANSFER" | null>(null)
  const total = cash + transfer
  const cashPercent = total > 0 ? (cash / total) * 100 : 50
  const transferPercent = total > 0 ? (transfer / total) * 100 : 50

  const radius = 15.91549430918954

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 p-4 w-full">
      {/* Tooltip Card Floating (Ringkas & Sederhana) */}
      {hoveredSlice && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white border-[2.5px] border-black p-2.5 rounded-[12px] z-50 text-[10px] pointer-events-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold space-y-1 animate-in fade-in zoom-in-95 duration-150 min-w-40 text-center">
          <p className="border-b border-neutral-700 pb-1 uppercase tracking-wider text-[9px] text-amber-400 flex items-center justify-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${hoveredSlice === "CASH" ? "bg-amber-400" : "bg-violet-400"}`} />
            {hoveredSlice === "CASH" ? "Pemasukan Tunai" : "Pemasukan Transfer"}
          </p>
          <div className="text-emerald-400 text-xs font-black tabular-nums pt-0.5">
            Rp {formatRupiah(hoveredSlice === "CASH" ? cash : transfer)}
          </div>
          <p className="text-[9px] text-neutral-400 font-semibold">
            {(hoveredSlice === "CASH" ? cashPercent : transferPercent).toFixed(1)}% dari total
          </p>
        </div>
      )}

      {/* Ilustrasi Lingkaran SVG */}
      <div className="relative w-36 h-36 shrink-0 group">
        <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 overflow-visible">
          {/* Sektor 1: Tunai/Cash (Warna Kuning Amber) */}
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={hoveredSlice === "CASH" ? 9 : 7}
            strokeDasharray={`${cashPercent} ${100 - cashPercent}`}
            strokeDashoffset="0"
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredSlice("CASH")}
            onMouseLeave={() => setHoveredSlice(null)}
          />
          {/* Sektor 2: Transfer (Warna Ungu Violet) */}
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            stroke="#8b5cf6"
            strokeWidth={hoveredSlice === "TRANSFER" ? 9 : 7}
            strokeDasharray={`${transferPercent} ${100 - transferPercent}`}
            strokeDashoffset={-cashPercent}
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredSlice("TRANSFER")}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        </svg>

        {/* Teks di Tengah Lingkaran */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-black text-xs text-neutral-800 pointer-events-none transition-all px-2 text-center">
          {hoveredSlice === "CASH" ? (
            <>
              <span className="text-amber-600 text-sm font-black tabular-nums">{cashPercent.toFixed(0)}%</span>
              <span className="text-[8px] font-bold text-amber-800 uppercase tracking-widest">Tunai</span>
            </>
          ) : hoveredSlice === "TRANSFER" ? (
            <>
              <span className="text-violet-600 text-sm font-black tabular-nums">{transferPercent.toFixed(0)}%</span>
              <span className="text-[8px] font-bold text-violet-800 uppercase tracking-widest">Transfer</span>
            </>
          ) : (
            <>
              <span>{total > 0 ? Math.round(cashPercent) : 50}%</span>
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Tunai</span>
            </>
          )}
        </div>
      </div>

      {/* Legenda (Keterangan Warna) */}
      <div className="space-y-2 text-xs font-bold w-full sm:w-auto">
        <div 
          className={cn(
            "flex items-center gap-2 p-1.5 rounded-lg border border-transparent transition-all cursor-pointer",
            hoveredSlice === "CASH" && "bg-amber-50 border-amber-300 shadow-[1px_1px_0px_0px_#000]"
          )}
          onMouseEnter={() => setHoveredSlice("CASH")}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <div className="h-4 w-4 bg-[#f59e0b] border-[2px] border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] shrink-0" />
          <div className="flex flex-col">
            <span className="text-neutral-700">Tunai (Cash)</span>
            <span className="text-[10px] text-amber-700 tabular-nums">
              Rp {formatRupiah(cash)} ({cashPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div 
          className={cn(
            "flex items-center gap-2 p-1.5 rounded-lg border border-transparent transition-all cursor-pointer",
            hoveredSlice === "TRANSFER" && "bg-violet-50 border-violet-300 shadow-[1px_1px_0px_0px_#000]"
          )}
          onMouseEnter={() => setHoveredSlice("TRANSFER")}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <div className="h-4 w-4 bg-[#8b5cf6] border-[2px] border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] shrink-0" />
          <div className="flex flex-col">
            <span className="text-neutral-700">Transfer (Online)</span>
            <span className="text-[10px] text-violet-700 tabular-nums">
              Rp {formatRupiah(transfer)} ({transferPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


// ==========================================
// 3. COMPONENT: DONUT CHART (KATEGORI PENGELUARAN)
// ==========================================
interface DonutChartProps {
  material: number
  labor: number
  operational: number
  other: number
}

export function DonutChart({ material, labor, operational, other }: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null)
  const total = material + labor + operational + other

  const getPercent = (val: number) => (total > 0 ? (val / total) * 100 : 0)

  const radius = 15.91549430918954

  const slices = [
    { value: getPercent(material), amount: material, color: "#ef4444", label: "Material" },
    { value: getPercent(labor), amount: labor, color: "#3b82f6", label: "Upah Tukang" },
    { value: getPercent(operational), amount: operational, color: "#eab308", label: "Operasional" },
    { value: getPercent(other), amount: other, color: "#10b981", label: "Lainnya" }
  ].filter(s => s.value > 0)

  if (slices.length === 0) {
    slices.push({ value: 100, amount: 0, color: "#e5e5e5", label: "Belum Ada Pengeluaran" })
  }

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null
  let accumulatedPercent = 0

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 p-4 w-full">
      {/* Tooltip Card Floating (Ringkas & Sederhana) */}
      {activeSlice && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white border-[2.5px] border-black p-2.5 rounded-[12px] z-50 text-[10px] pointer-events-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold space-y-1 animate-in fade-in zoom-in-95 duration-150 min-w-44 text-center">
          <p className="border-b border-neutral-700 pb-1 uppercase tracking-wider text-[9px] text-red-400 flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: activeSlice.color }} />
            Belanja {activeSlice.label}
          </p>
          <div className="text-emerald-400 text-xs font-black tabular-nums pt-0.5">
            Rp {formatRupiah(activeSlice.amount)}
          </div>
          <p className="text-[9px] text-neutral-400 font-semibold">
            {activeSlice.value.toFixed(1)}% dari total pengeluaran
          </p>
        </div>
      )}

      {/* Ilustrasi Donat SVG */}
      <div className="relative w-36 h-36 shrink-0 group">
        <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 overflow-visible">
          {slices.map((slice, idx) => {
            const offset = -accumulatedPercent
            accumulatedPercent += slice.value
            const isHovered = hoveredIdx === idx

            return (
              <circle
                key={idx}
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? 9 : 7}
                strokeDasharray={`${slice.value} ${100 - slice.value}`}
                strokeDashoffset={offset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            )
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-black text-xs text-neutral-800 pointer-events-none transition-all px-2 text-center">
          {activeSlice ? (
            <>
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider truncate max-w-[80px]">
                {activeSlice.label}
              </span>
              <span className="text-[10px] font-black text-neutral-900 tabular-nums">
                Rp {formatRupiah(activeSlice.amount)}
              </span>
              <span className="text-[8px] font-bold text-amber-600 tabular-nums">
                ({activeSlice.value.toFixed(1)}%)
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total</span>
              <span className="text-[10px] font-black text-neutral-800 tabular-nums">Rp {formatRupiah(total)}</span>
            </>
          )}
        </div>
      </div>

      {/* Legenda Kategori */}
      <div className="space-y-1.5 text-xs font-bold w-full sm:w-auto">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx
          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-center gap-2 p-1.5 rounded-lg border border-transparent transition-all cursor-pointer",
                isHovered && "bg-neutral-100 border-neutral-300 shadow-[1px_1px_0px_0px_#000]"
              )}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div 
                style={{ backgroundColor: slice.color }} 
                className="h-3.5 w-3.5 border-[2px] border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] shrink-0" 
              />
              <div className="flex flex-col min-w-32">
                <span className="text-neutral-700">{slice.label}</span>
                {slice.amount > 0 && (
                  <span className="text-[9px] text-neutral-500 font-semibold tabular-nums">
                    Rp {formatRupiah(slice.amount)} ({slice.value.toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ==========================================
// 4. COMPONENT: BAR CHART (TREN PEMASUKAN & PENGELUARAN)
// ==========================================
interface MonthlyData {
  label: string      // nama bulan, misal: "Jan", "Feb"
  income: number     // total nominal pemasukan bulan itu
  expense: number    // total nominal pengeluaran bulan itu
}

interface BarChartProps {
  data: MonthlyData[]
}

export function BarChart({ data }: BarChartProps) {
  // Cari nilai tertinggi di antara seluruh data pemasukan & pengeluaran untuk skala tinggi grafik.
  // Nilai minimal diset Rp 1.000.000 agar grafik tidak berantakan jika data kosong.
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.income, d.expense)),
    1000000
  )

  return (
    <div className="w-full space-y-4">
      {/* Wadah Grafik Batang */}
      <div className="h-64 flex items-end justify-between gap-1.5 pt-6 border-b-[2.5px] border-black px-1 md:px-3">
        {data.map((d, index) => {
          // Hitung tinggi relatif (dalam persentase %) masing-masing batang
          const incomeHeight = `${(d.income / maxValue) * 100}%`
          const expenseHeight = `${(d.expense / maxValue) * 100}%`

          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center h-full justify-end group relative"
            >
              {/* Tooltip Card (Neobrutalist, muncul saat batang di-hover oleh kursor) */}
              <div className="absolute bottom-full mb-2 bg-neutral-900 text-white border-[2px] border-black p-2.5 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity z-50 text-[10px] pointer-events-none shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] w-36 font-bold space-y-1.5 left-1/2 transform -translate-x-1/2">
                <p className="text-center border-b border-neutral-700 pb-1 uppercase tracking-wider text-[8px] text-neutral-400">
                  {d.label}
                </p>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Masuk:</span>
                  <span className="tabular-nums">+{formatRupiah(d.income)}</span>
                </div>
                <div className="flex justify-between items-center text-red-400">
                  <span>Keluar:</span>
                  <span className="tabular-nums">-{formatRupiah(d.expense)}</span>
                </div>
              </div>

              {/* Batang Grafik Side-by-Side (Berdampingan) */}
              <div className="w-full flex items-end justify-center gap-0.5 md:gap-1 h-full">
                
                {/* Batang Pemasukan (Hijau Emerald) */}
                <div
                  style={{ height: incomeHeight }}
                  className="w-1/2 min-h-[4px] bg-emerald-400 border-[2px] border-black rounded-t-[4px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-emerald-500 transition-colors"
                />
                
                {/* Batang Pengeluaran (Merah Crimson) */}
                <div
                  style={{ height: expenseHeight }}
                  className="w-1/2 min-h-[4px] bg-red-400 border-[2px] border-black rounded-t-[4px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:bg-red-500 transition-colors"
                />
                
              </div>
            </div>
          )
        })}
      </div>

      {/* Label Keterangan Bulan */}
      <div className="flex justify-between text-[9px] font-black uppercase text-neutral-600 px-1 md:px-3">
        {data.map((d, idx) => (
          <span key={idx} className="flex-1 text-center truncate px-0.5">
            {d.label}
          </span>
        ))}
      </div>

      {/* Legenda Keterangan Batang */}
      <div className="flex justify-center gap-6 text-[10px] font-bold pt-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 bg-emerald-400 border-[1.5px] border-black rounded shadow-[1px_1px_0px_0px_#000]" />
          <span>Total Pemasukan Kas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 bg-red-400 border-[1.5px] border-black rounded shadow-[1px_1px_0px_0px_#000]" />
          <span>Total Pengeluaran Belanja</span>
        </div>
      </div>
    </div>
  )
}
