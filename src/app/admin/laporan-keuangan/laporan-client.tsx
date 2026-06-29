"use client"

import * as React from "react"
import { Wallet, TrendingUp, TrendingDown, Target, BarChart2, PieChart as PieIcon, HelpCircle, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/format"
import { ProgressBar, PieChart, DonutChart, BarChart } from "@/components/dashboard/dashboard-charts"

interface Donor {
  no: number
  donorName: string
  donorAddress: string
  donorPhone: string
}

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
  donors?: Donor[]
}

export default function LaporanClient({
  totalCash,
  totalTransfer,
  totalExpense,
  expenseCategories,
  transferChannels,
  monthlyTrend,
  donors = [],
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

  // Unduh Daftar Donatur ke PDF
  const handleDownloadDonorsPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      const today = new Date()
      const day = today.getDate()
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ]
      const month = monthNames[today.getMonth()]
      const year = today.getFullYear()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Header Laporan
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.text("DAFTAR DONATUR PEMBANGUNAN MENARA MASJID AL-IKHLAS", pageWidth / 2, 15, { align: "center" })
      
      doc.setFontSize(9.5)
      doc.setFont("helvetica", "normal")
      doc.text("Masjid Al-Ikhlas Meranjat II", pageWidth / 2, 20, { align: "center" })
      doc.text(`Dicetak pada tanggal: ${day} ${month} ${year}`, pageWidth / 2, 24, { align: "center" })

      // Mapping data donatur
      const bodyRows = donors.map((item, idx) => [
        idx + 1,
        item.donorName.toUpperCase(),
        item.donorAddress || "-",
        item.donorPhone || "-"
      ])

      autoTable(doc, {
        startY: 29,
        head: [
          ["No", "Nama Donatur", "Alamat", "No. Telepon / WA"]
        ],
        body: bodyRows,
        theme: "grid",
        headStyles: {
          fillColor: [17, 24, 39], // Slate-900 / Black
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center"
        },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          lineColor: [209, 213, 219] // gray-300 grid borders
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 65 },
          2: { cellWidth: 70 },
          3: { cellWidth: 40, halign: "center" }
        }
      })

      doc.save(`Daftar_Donatur_Menara_Al_Ikhlas_${day}_${month}_${year}.pdf`)
    } catch (err) {
      console.error("Gagal mengekspor PDF donatur:", err)
      alert("Terjadi kesalahan saat mengunduh PDF.")
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

      {/* =============================================================
          4. TABEL DAFTAR DONATUR MASJID (NEOBRUTALIST TABEL)
          ============================================================= */}
      {isAdmin && (
        <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800 flex items-center gap-2">
                🕌 Daftar Donatur Masjid Al-Ikhlas
              </CardTitle>
              <CardDescription className="text-[10px] text-neutral-500 font-medium">
                Kumpulan seluruh nama donatur beserta nomor kontak aktif (diperoleh dari input manual & donasi online).
              </CardDescription>
            </div>
            {donors.length > 0 && (
              <button
                onClick={handleDownloadDonorsPDF}
                className="flex items-center justify-center gap-1.5 border-[2px] border-black bg-blue-100 text-blue-900 hover:bg-blue-200 text-[10px] font-black uppercase px-3.5 py-2 rounded-[10px] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer self-start sm:self-auto"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                Unduh Data Donatur
              </button>
            )}
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {donors.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-neutral-400 italic">
                Belum ada data donatur yang tersimpan.
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-[2px] border-black bg-emerald-50/50">
                    <th className="p-3 text-[10px] font-black uppercase text-emerald-900 w-[6%] text-center border-r border-emerald-200 last:border-r-0">No</th>
                    <th className="p-3 text-[10px] font-black uppercase text-emerald-900 w-[30%] border-r border-emerald-200 last:border-r-0">Nama Donatur</th>
                    <th className="p-3 text-[10px] font-black uppercase text-emerald-900 w-[42%] border-r border-emerald-200 last:border-r-0">Alamat</th>
                    <th className="p-3 text-[10px] font-black uppercase text-emerald-900 w-[14%] text-center border-r border-emerald-200 last:border-r-0">No. Telepon / WA</th>
                    <th className="p-3 text-[10px] font-black uppercase text-emerald-900 w-[8%] text-center last:border-r-0">Hubungi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[1.5px] divide-neutral-200">
                  {donors.map((item, idx) => {
                    const cleanedPhone = item.donorPhone 
                      ? `62${item.donorPhone.replace(/^0/, "").replace(/[^0-9]/g, "")}` 
                      : "";
                    return (
                      <tr key={idx} className="hover:bg-neutral-50/70 border-b border-neutral-200 transition-colors last:border-b-0">
                        {/* No */}
                        <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] font-bold text-neutral-500 tabular-nums">
                          {idx + 1}
                        </td>
                        {/* Nama Donatur */}
                        <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                          <div className="font-black text-neutral-800 text-[11px] uppercase tracking-tight">
                            {item.donorName}
                          </div>
                        </td>
                        {/* Alamat */}
                        <td className="p-3 border-r border-neutral-200 last:border-r-0 whitespace-normal">
                          <div className="text-[10px] text-neutral-700 font-medium leading-relaxed">
                            {item.donorAddress || "-"}
                          </div>
                        </td>
                        {/* No. Telepon / WA */}
                        <td className="p-3 border-r border-neutral-200 last:border-r-0 text-center text-[10px] text-neutral-700 font-medium tabular-nums">
                          {item.donorPhone || <span className="text-neutral-300 font-normal">—</span>}
                        </td>
                        {/* Hubungi */}
                        <td className="p-3 text-center">
                          {cleanedPhone ? (
                            <a
                              href={`https://web.whatsapp.com/send?phone=${cleanedPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border-[1.5px] border-black bg-emerald-100 hover:bg-emerald-200 text-emerald-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-px transition-all cursor-pointer"
                              title="Hubungi WhatsApp"
                            >
                              <svg className="h-3.5 w-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-[9px] text-neutral-400 font-medium italic">Tidak ada WA</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  )
}
