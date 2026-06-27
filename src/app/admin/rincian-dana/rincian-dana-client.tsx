"use client"

import * as React from "react"
import { PlusCircle, MinusCircle, FileText, Calendar, Wallet, Layers, Eye, ChevronLeft, ChevronRight, X, RotateCcw, AlertTriangle } from "lucide-react"
import { getSignedUrls } from "@/app/admin/pemasukan/actions"
import { cn } from "@/lib/utils"
import { formatRupiah } from "@/lib/format"

// Indonesian month names for date filters
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

interface IncomeItem {
  id: string
  donorName: string
  donorAddress: string
  amount: number
  date: string
  description: string
  type: "CASH" | "TRANSFER"
  receiptUrls: string[]
}

interface OutcomeItem {
  id: string
  buyer: string
  amount: number
  date: string
  description: string
  category: "MATERIAL" | "LABOR" | "OPERATIONAL" | "OTHER"
  receiptUrls: string[]
}

interface RincianDanaClientProps {
  incomes: IncomeItem[]
  outcomes: OutcomeItem[]
}

export default function RincianDanaClient({ incomes, outcomes }: RincianDanaClientProps) {
  // Active Tab: 'income' or 'outcome'
  const [activeTab, setActiveTab] = React.useState<"income" | "outcome">("income")

  // --- FILTER STATES ---
  // Income Filters
  const [incomeType, setIncomeType] = React.useState<string>("all")
  const [incomeAmountRange, setIncomeAmountRange] = React.useState<string>("all")
  const [incomeMonth, setIncomeMonth] = React.useState<string>("all")

  // Outcome Filters
  const [outcomeCategory, setOutcomeCategory] = React.useState<string>("all")
  const [outcomeAmountRange, setOutcomeAmountRange] = React.useState<string>("all")
  const [outcomeMonth, setOutcomeMonth] = React.useState<string>("all")

  // --- LIGHTBOX CAROUSEL STATE ---
  const [lightbox, setLightbox] = React.useState<{
    isOpen: boolean
    isLoading: boolean
    urls: string[]
    currentIndex: number
    error: string | null
  }>({
    isOpen: false,
    isLoading: false,
    urls: [],
    currentIndex: 0,
    error: null
  })

  // --- EXTRACT DYNAMIC MONTHS ---
  const uniqueIncomeMonths = React.useMemo(() => {
    return getUniqueMonths(incomes.map(i => i.date))
  }, [incomes])

  const uniqueOutcomeMonths = React.useMemo(() => {
    return getUniqueMonths(outcomes.map(o => o.date))
  }, [outcomes])

  // --- FILTER LOGIC ---
  const filteredIncomes = React.useMemo(() => {
    return incomes.filter(item => {
      const matchType = incomeType === "all" || item.type === incomeType
      const matchAmount = filterByAmountRange(item.amount, incomeAmountRange)
      const matchMonth = filterByMonth(item.date, incomeMonth)
      return matchType && matchAmount && matchMonth
    })
  }, [incomes, incomeType, incomeAmountRange, incomeMonth])

  const filteredOutcomes = React.useMemo(() => {
    return outcomes.filter(item => {
      const matchCategory = outcomeCategory === "all" || item.category === outcomeCategory
      const matchAmount = filterByAmountRange(item.amount, outcomeAmountRange)
      const matchMonth = filterByMonth(item.date, outcomeMonth)
      return matchCategory && matchAmount && matchMonth
    })
  }, [outcomes, outcomeCategory, outcomeAmountRange, outcomeMonth])

  // Reset all filters for active tab
  const handleResetFilters = () => {
    if (activeTab === "income") {
      setIncomeType("all")
      setIncomeAmountRange("all")
      setIncomeMonth("all")
    } else {
      setOutcomeCategory("all")
      setOutcomeAmountRange("all")
      setOutcomeMonth("all")
    }
  }

  // --- PREVIEW IMAGES ON-DEMAND ---
  const handlePreviewImages = async (receiptUrls: string[]) => {
    if (!receiptUrls || receiptUrls.length === 0) return

    setLightbox({
      isOpen: true,
      isLoading: true,
      urls: [],
      currentIndex: 0,
      error: null
    })

    try {
      const result = await getSignedUrls(receiptUrls)
      if (result.success && result.urls) {
        setLightbox(prev => ({
          ...prev,
          isLoading: false,
          urls: result.urls || [],
          error: null
        }))
      } else {
        throw new Error(result.error || "Gagal memproses link gambar.")
      }
    } catch (e) {
      setLightbox(prev => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : "Gagal memuat berkas bukti belanja."
      }))
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FileText className="h-5 w-5 text-neutral-800" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Rincian Dana Pembangunan</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Laporan audit transaksi riil pembangunan Menara Al-Ikhlas</p>
        </div>
      </div>

      {/* Tabs - Brutalist Toggle */}
      <div className="flex border-[2px] border-black rounded-[14px] bg-white overflow-hidden p-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => setActiveTab("income")}
          className={cn(
            "flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
            activeTab === "income"
              ? "bg-blue-100 text-blue-800 border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          Pemasukan
        </button>
        <button
          onClick={() => setActiveTab("outcome")}
          className={cn(
            "flex-1 py-2 text-center text-xs font-black uppercase rounded-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
            activeTab === "outcome"
              ? "bg-red-100 text-red-800 border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <MinusCircle className="h-4 w-4 shrink-0" />
          Pengeluaran
        </button>
      </div>

      {/* --- FILTERS PANEL --- */}
      <div className="border-[2px] border-black bg-white rounded-[16px] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1">
            ⚡ Filter Pencarian
          </span>
          {((activeTab === "income" && (incomeType !== "all" || incomeAmountRange !== "all" || incomeMonth !== "all")) ||
            (activeTab === "outcome" && (outcomeCategory !== "all" || outcomeAmountRange !== "all" || outcomeMonth !== "all"))) && (
            <button
              onClick={handleResetFilters}
              className="text-[9px] font-black uppercase text-amber-800 hover:text-amber-950 flex items-center gap-1 border-[1.5px] border-black bg-amber-50 px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeTab === "income" ? (
            <>
              {/* Type Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-700 flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-blue-600" /> Tipe Pembayaran
                </label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-1.5 bg-neutral-50 focus:outline-none focus:bg-white"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="CASH">Luring / Cash</option>
                  <option value="TRANSFER">Daring / Transfer</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-700 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-red-600" /> Kategori Belanja
                </label>
                <select
                  value={outcomeCategory}
                  onChange={(e) => setOutcomeCategory(e.target.value)}
                  className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-1.5 bg-neutral-50 focus:outline-none focus:bg-white"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="MATERIAL">Material Bangunan</option>
                  <option value="LABOR">Upah Pekerja / Tukang</option>
                  <option value="OPERATIONAL">Operasional / Konsumsi</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>
            </>
          )}

          {/* Amount Range Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-neutral-700 flex items-center gap-1">
              💰 Rentang Nominal
            </label>
            <select
              value={activeTab === "income" ? incomeAmountRange : outcomeAmountRange}
              onChange={(e) => activeTab === "income" ? setIncomeAmountRange(e.target.value) : setOutcomeAmountRange(e.target.value)}
              className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-1.5 bg-neutral-50 focus:outline-none focus:bg-white"
            >
              <option value="all">Semua Nominal</option>
              <option value="under_1m">Di bawah Rp 1 Juta</option>
              <option value="above_1m">Di atas / sama dengan Rp 1 Juta</option>
              <option value="above_5m">Di atas / sama dengan Rp 5 Juta</option>
              <option value="above_10m">Di atas / sama dengan Rp 10 Juta</option>
            </select>
          </div>

          {/* Date Filter (Month) */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-neutral-700 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-neutral-600" /> Bulan Transaksi
            </label>
            <select
              value={activeTab === "income" ? incomeMonth : outcomeMonth}
              onChange={(e) => activeTab === "income" ? setIncomeMonth(e.target.value) : setOutcomeMonth(e.target.value)}
              className="w-full text-xs font-bold border-[1.5px] border-black rounded-[8px] p-1.5 bg-neutral-50 focus:outline-none focus:bg-white"
            >
              <option value="all">Semua Bulan</option>
              {(activeTab === "income" ? uniqueIncomeMonths : uniqueOutcomeMonths).map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTENT PANEL --- */}
      <div className="border-[2px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "income" ? (
            // INCOMES TABLE
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-black bg-blue-50/50">
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[40%]">Donatur & Alamat</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[20%] text-right">Nominal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[15%] text-center">Tanggal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[15%] text-center">Tipe</th>
                  <th className="p-3 text-[10px] font-black uppercase text-blue-900 w-[10%] text-center">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-neutral-200">
                {filteredIncomes.length > 0 ? (
                  filteredIncomes.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Name & Address */}
                      <td className="p-3 whitespace-normal">
                        <div className="font-black text-neutral-800 text-[11px] uppercase tracking-tight">{item.donorName}</div>
                        {item.donorAddress && (
                          <div className="text-[9px] text-muted-foreground font-semibold leading-tight mt-0.5 italic">{item.donorAddress}</div>
                        )}
                        {item.description && (
                          <div className="text-[9px] text-neutral-600 bg-neutral-100 rounded px-1.5 py-0.5 mt-1 border border-neutral-300 w-fit break-words whitespace-pre-wrap font-medium">
                            📝 {item.description}
                          </div>
                        )}
                      </td>
                      {/* Amount */}
                      <td className="p-3 text-right font-black text-[11px] text-emerald-800 tabular-nums">
                        Rp {formatRupiah(item.amount)}
                      </td>
                      {/* Date */}
                      <td className="p-3 text-center text-[10px] font-bold text-neutral-600 tabular-nums">
                        {formatLocalDate(item.date)}
                      </td>
                      {/* Type */}
                      <td className="p-3 text-center">
                        <span className={cn(
                          "inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
                          item.type === "TRANSFER"
                            ? "bg-purple-100 text-purple-800 border-purple-400"
                            : "bg-amber-100 text-amber-800 border-amber-400"
                        )}>
                          {item.type === "TRANSFER" ? "Transfer" : "Tunai"}
                        </span>
                      </td>
                      {/* Proof Icon/Button */}
                      <td className="p-3 text-center">
                        {item.receiptUrls && item.receiptUrls.length > 0 ? (
                          <button
                            onClick={() => handlePreviewImages(item.receiptUrls)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-blue-100 hover:bg-blue-200 text-blue-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Lihat Bukti Terima"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-neutral-400 font-bold italic">
                      Tidak ada rincian data pemasukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // OUTCOMES TABLE
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-black bg-red-50/50">
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[40%]">Keperluan & Buyer</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[20%] text-right">Nominal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[15%] text-center">Tanggal</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[15%] text-center">Kategori</th>
                  <th className="p-3 text-[10px] font-black uppercase text-red-900 w-[10%] text-center">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-neutral-200">
                {filteredOutcomes.length > 0 ? (
                  filteredOutcomes.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Description & Buyer */}
                      <td className="p-3 whitespace-normal">
                        <div className="text-[11px] text-neutral-800 font-bold break-words whitespace-pre-wrap leading-snug">
                          {item.description}
                        </div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-wide mt-1">
                          👤 Belanja oleh: <span className="text-neutral-800">{item.buyer}</span>
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="p-3 text-right font-black text-[11px] text-red-800 tabular-nums">
                        Rp {formatRupiah(item.amount)}
                      </td>
                      {/* Date */}
                      <td className="p-3 text-center text-[10px] font-bold text-neutral-600 tabular-nums">
                        {formatLocalDate(item.date)}
                      </td>
                      {/* Category */}
                      <td className="p-3 text-center">
                        <span className="inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-neutral-400 bg-neutral-100 text-neutral-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          {translateCategory(item.category)}
                        </span>
                      </td>
                      {/* Receipt Icon/Button */}
                      <td className="p-3 text-center">
                        {item.receiptUrls && item.receiptUrls.length > 0 ? (
                          <button
                            onClick={() => handlePreviewImages(item.receiptUrls)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-red-100 hover:bg-red-200 text-red-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                            title="Lihat Nota Belanja"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-semibold italic">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-neutral-400 font-bold italic">
                      Tidak ada rincian data pengeluaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL DIALOG --- */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full border-[3px] border-black bg-white rounded-[24px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Modal Header */}
            <div className="flex h-12 w-full items-center justify-between border-b-[2.5px] border-black bg-blue-50/50 px-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                🖼️ Pratinjau Bukti / Nota Belanja
              </span>
              <button
                onClick={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
                className="h-7 w-7 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-red-50 text-neutral-700 shadow-[1px_1px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Modal Body / Image Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#faf8f5] min-h-[280px]">
              {lightbox.isLoading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded-full border-[3px] border-neutral-300 border-t-blue-600 animate-spin" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Memuat Gambar...</span>
                </div>
              ) : lightbox.error ? (
                // Error State
                <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center border border-red-400 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] font-bold text-red-900">{lightbox.error}</div>
                  <button
                    onClick={() => lightbox.urls && handlePreviewImages(lightbox.urls)}
                    className="text-[9px] font-black uppercase border-[1.5px] border-black bg-white hover:bg-neutral-50 px-3 py-1 rounded-[8px] shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-px active:shadow-none transition-all cursor-pointer mt-1"
                  >
                    Muat Ulang
                  </button>
                </div>
              ) : (
                // Images Carousel Display
                <div className="w-full space-y-4">
                  {lightbox.urls.length > 0 ? (
                    <div className="relative aspect-[4/3] w-full rounded-[16px] border-[2.5px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
                      {/* Current Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lightbox.urls[lightbox.currentIndex]}
                        alt={`Bukti Pembayaran ${lightbox.currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />

                      {/* Navigation Prev Button */}
                      {lightbox.urls.length > 1 && (
                        <button
                          onClick={() => setLightbox(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex === 0 ? prev.urls.length - 1 : prev.currentIndex - 1
                          }))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_0px_#000] active:scale-95 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}

                      {/* Navigation Next Button */}
                      {lightbox.urls.length > 1 && (
                        <button
                          onClick={() => setLightbox(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex === prev.urls.length - 1 ? 0 : prev.currentIndex + 1
                          }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_0px_#000] active:scale-95 transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 font-bold italic text-center py-8">
                      Tidak ada berkas bukti belanja.
                    </div>
                  )}

                  {/* Carousel Indicators / Meta */}
                  {lightbox.urls.length > 1 && (
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-600 px-1">
                      <span>Pratinjau Bukti Belanja</span>
                      <span className="border-[1.5px] border-black bg-yellow-50 px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                        {lightbox.currentIndex + 1} dari {lightbox.urls.length} Berkas
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// --- HELPER FUNCTIONS ---

// 1. Get unique month labels from date list
function getUniqueMonths(dates: string[]): { value: string; label: string }[] {
  const monthsMap = new Map<string, { year: number; month: number }>()

  dates.forEach((dStr) => {
    const d = new Date(dStr)
    const m = d.getMonth()
    const y = d.getFullYear()
    const key = `${y}-${String(m).padStart(2, "0")}`
    monthsMap.set(key, { year: y, month: m })
  })

  // Sort descending by date key
  const sortedKeys = Array.from(monthsMap.keys()).sort().reverse()

  return sortedKeys.map((key) => {
    const item = monthsMap.get(key)!
    const label = `${MONTH_NAMES[item.month]} ${item.year}`
    return { value: key, label }
  })
}

// 2. Filter transaction by range
function filterByAmountRange(amount: number, range: string): boolean {
  if (range === "all") return true
  if (range === "under_1m") return amount < 1000000
  if (range === "above_1m") return amount >= 1000000
  if (range === "above_5m") return amount >= 5000000
  if (range === "above_10m") return amount >= 10000000
  return true
}

// 3. Filter transaction by Month-Year key
function filterByMonth(dateStr: string, selectedMonthKey: string): boolean {
  if (selectedMonthKey === "all") return true
  const d = new Date(dateStr)
  const m = d.getMonth()
  const y = d.getFullYear()
  const key = `${y}-${String(m).padStart(2, "0")}`
  return key === selectedMonthKey
}

// 4. Formatting date into DD/MM/YYYY
function formatLocalDate(isoString: string): string {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// 5. Translating categories into Indonesian
function translateCategory(category: string): string {
  switch (category) {
    case "MATERIAL":
      return "Material"
    case "LABOR":
      return "Upah Tukang"
    case "OPERATIONAL":
      return "Operasional"
    case "OTHER":
      return "Lainnya"
    default:
      return category
  }
}
