"use client"

import * as React from "react"
import { Calendar, CircleDollarSign, FileText, Upload, X, Check, Image as ImageIcon, Tag, Layers, MinusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatRupiah, formatTerbilang } from "@/lib/format"
import { createPengeluaran } from "./actions"

// Definisikan kategori pengeluaran berdasarkan Enum Prisma
const expenseCategories = [
  { value: "MATERIAL", label: "Material (Semen, Besi, dll)" },
  { value: "LABOR", label: "Tenaga Kerja (Upah Tukang)" },
  { value: "OPERATIONAL", label: "Operasional (Konsumsi, Transport)" },
  { value: "OTHER", label: "Lainnya (Tulis di Keterangan)" },
]

interface RecentOutcome {
  id: string
  buyer: string
  amount: number
  date: string
  category: "MATERIAL" | "LABOR" | "OPERATIONAL" | "OTHER"
  description: string
}

interface PengeluaranClientProps {
  recentOutcomes: RecentOutcome[]
}

export default function PengeluaranClient({ recentOutcomes }: PengeluaranClientProps) {
  // State Form
  const [amountInput, setAmountInput] = React.useState("")
  const [amount, setAmount] = React.useState<number>(0)
  const [date, setDate] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [category, setCategory] = React.useState("")
  const [buyer, setBuyer] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedFiles, setSelectedFiles] = React.useState<{ file: File; preview: string }[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Local state to keep track of recent outcomes for real-time update
  const [outcomesList, setOutcomesList] = React.useState<RecentOutcome[]>(recentOutcomes)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Format nominal rupiah
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "")
    if (!rawValue) {
      setAmountInput("")
      setAmount(0)
      return
    }

    const numericValue = parseInt(rawValue, 10)
    setAmount(numericValue)

    const formatted = formatRupiah(numericValue)
    setAmountInput(formatted)
  }

  // Pilih file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles: { file: File; preview: string }[] = []

      for (const file of filesArray) {
        // Client-side validation: Max 10MB
        if (file.size > 10 * 1024 * 1024) {
          setError(`Berkas "${file.name}" terlalu besar. Ukuran maksimal adalah 10MB.`)
          return
        }

        // Client-side validation: Image files only
        if (!file.type.startsWith("image/")) {
          setError(`Berkas "${file.name}" harus berupa file gambar (JPG/PNG/WebP).`)
          return
        }

        validFiles.push({
          file,
          preview: URL.createObjectURL(file)
        })
      }

      setSelectedFiles(prev => [...prev, ...validFiles])
      setError(null)
    }
  }

  // Hapus gambar terpilih
  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  React.useEffect(() => {
    return () => {
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
    }
  }, [selectedFiles])

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (amount <= 0) {
      setError("Nominal pengeluaran harus lebih dari Rp 0.")
      return
    }
    if (!date) {
      setError("Tanggal pengeluaran harus diisi.")
      return
    }
    if (!category) {
      setError("Silakan pilih kategori pengeluaran.")
      return
    }
    if (!buyer.trim()) {
      setError("Nama penanggung jawab belanja harus diisi.")
      return
    }
    if (!description.trim()) {
      setError("Keterangan belanja harus diisi.")
      return
    }

    setIsSubmitting(true)

    try {
      // Siapkan FormData untuk dikirim ke Server Action
      const formData = new FormData()
      formData.append("amount", amount.toString())
      formData.append("date", date)
      formData.append("category", category)
      formData.append("buyer", buyer.trim())
      formData.append("description", description.trim())

      // Masukkan file-file biner ke FormData
      selectedFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file)
      })

      // Panggil Server Action
      const result = await createPengeluaran(null, formData)

      if (!result.success) {
        setError(result.error || "Gagal menyimpan data pengeluaran.")
        return
      }

      // Prepend to local quick-log list (max 5)
      const newOutcome: RecentOutcome = {
        id: result.data?.id || Math.random().toString(),
        buyer: buyer.trim(),
        amount: amount,
        date: new Date(date).toISOString(),
        category: category as any,
        description: description.trim()
      }
      setOutcomesList(prev => [newOutcome, ...prev].slice(0, 5))

      // Sukses
      setSuccess(true)
      setAmountInput("")
      setAmount(0)
      setCategory("")
      setBuyer("")
      setDescription("")
      
      // Bersihkan preview file
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
      setSelectedFiles([])
      
      // Scroll ke atas
      window.scrollTo({ top: 0, behavior: 'smooth' })

      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format local date for recent list
  const formatLocalDate = (isoStr: string) => {
    const d = new Date(isoStr)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  }

  // Translate category key for UI
  const translateCategory = (cat: string) => {
    switch (cat) {
      case "MATERIAL": return "Material"
      case "LABOR": return "Upah Tukang"
      case "OPERATIONAL": return "Operasional"
      case "OTHER": return "Lainnya"
      default: return cat
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-red-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <MinusCircle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Catat Pengeluaran Kas</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Input manual belanja/operasional pembangunan menara</p>
        </div>
      </div>

      {/* Grid Layout: Form on left, recent logs on right (desktop only) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Container (Left Column) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Notifikasi Sukses */}
            {success && (
              <div className="flex items-center gap-2 rounded-[14px] border-[2.5px] border-black bg-emerald-100 p-3.5 text-xs text-emerald-900 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold border-[1.5px] border-black text-[10px]">✓</div>
                <span>Pengeluaran berhasil dicatat</span>
              </div>
            )}

            {/* Notifikasi Gagal */}
            {error && (
              <div className="rounded-[14px] border-[2.5px] border-black bg-red-100 p-3.5 text-xs text-red-900 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}

            <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#dc2626] overflow-hidden">
              <CardHeader className="pb-3 border-b-[2.5px] border-black bg-red-50/50">
                <CardTitle className="text-xs font-black uppercase tracking-tight text-red-800">Formulir Pengeluaran</CardTitle>
                <CardDescription className="text-[10px] text-neutral-700 font-medium">Lengkapi rincian pengeluaran belanja pembangunan di bawah ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                
                {/* Input Nominal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-red-600">◆</span> Nominal Transaksi
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-neutral-500 font-black">Rp</span>
                    <Input
                      type="text"
                      placeholder="0"
                      value={amountInput}
                      onChange={handleAmountChange}
                      disabled={isSubmitting}
                      className="pl-9 pr-3 py-5 font-black text-base border-[2.5px] border-black rounded-[12px] bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-red-600 focus-visible:shadow-[2px_2px_0px_0px_#dc2626] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      required
                    />
                  </div>
                  {amount > 0 ? (
                    <p className="text-[10px] text-red-700 font-bold italic bg-red-50/60 border border-red-200 rounded-md px-2 py-1">
                      Terbilang: {formatTerbilang(amount)}
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground font-medium pl-1">
                      Nominal terbilang akan muncul disini.
                    </p>
                  )}
                </div>

                {/* Input Tanggal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-red-600">◆</span> Tanggal Transaksi
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-red-600 focus-visible:shadow-[2px_2px_0px_0px_#dc2626] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                </div>

                {/* Input Penanggung Jawab Belanja */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-red-600">◆</span> Penanggung Jawab Belanja
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh : Bapak Candra, Bapak Agus"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-red-600 focus-visible:shadow-[2px_2px_0px_0px_#dc2626] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                </div>

                {/* Input Kategori Dropdown Custom Neobrutalist */}
                <div className="space-y-1.5" ref={dropdownRef}>
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-red-600">◆</span> Kategori
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                      disabled={isSubmitting}
                      className="flex h-11 w-full items-center justify-between rounded-[12px] border-[2.5px] border-black bg-white px-3 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed text-left text-foreground cursor-pointer"
                    >
                      <span>
                        {category 
                          ? expenseCategories.find(c => c.value === category)?.label 
                          : "-- Pilih Kategori --"}
                      </span>
                      <svg 
                        className={cn("h-4 w-4 transition-transform text-muted-foreground", isDropdownOpen && "rotate-180")} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white border-[2.5px] border-black rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-top-1 duration-150">
                        {expenseCategories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setCategory(cat.value)
                              setIsDropdownOpen(false)
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 text-xs font-bold border-b-[1.5px] border-black last:border-b-0 transition-colors cursor-pointer",
                              category === cat.value 
                                ? "bg-red-50 text-red-700" 
                                : "hover:bg-neutral-50 text-neutral-800"
                            )}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Keterangan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-red-600">◆</span> Keterangan Belanja
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh : Pembelian semen 50 sak..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-red-600 focus-visible:shadow-[2px_2px_0px_0px_#dc2626] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                </div>

                <hr className="border-t-[2.5px] border-black" />

                {/* Bagian Uploader File (Selalu Ditampilkan) */}
                <div className="space-y-3 rounded-[16px] border-[2px] border-dashed border-black bg-[#fdfdfd] p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-neutral-700 uppercase tracking-wider">Upload nota / bukti</label>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-bold border border-black bg-white px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                        Gambar Nota
                      </span>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div 
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-[12px] border-[2px] border-dashed border-neutral-400 bg-[#f7f5f0] p-5 text-center cursor-pointer transition-colors hover:bg-neutral-100",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                    <div className="h-10 w-10 bg-yellow-300 border-[2.5px] border-black rounded-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-2">
                      <Upload className="h-5 w-5 text-black font-bold" />
                    </div>
                    <p className="text-xs font-black text-neutral-800">Klik untuk unggah gambar nota</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Bisa unggah lebih dari 1 foto.</p>
                  </div>

                  {/* Preview Berkas terpilih */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Kuitansi terpilih ({selectedFiles.length}):</p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedFiles.map((fileObj, idx) => (
                          <div key={idx} className="relative group rounded-[10px] border-[2px] border-black bg-white p-1 h-16 w-full flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={fileObj.preview}
                              alt={`Preview ${idx + 1}`}
                              className="object-cover h-full w-full rounded-[6px]"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-[1.5px] border-black hover:bg-red-600 shadow-sm transition-all cursor-pointer"
                              title="Hapus kuitansi"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
              
              <CardFooter className="pt-2 pb-4 border-t-[2.5px] border-black bg-red-50/20">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-[#ff4a4a] hover:bg-red-600 text-white rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-5 w-full"
                >
                  {isSubmitting ? "Menyimpan..." : "Catat Pengeluaran"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* --- QUICK DETAILS LOG (Right Column, Desktop Only) --- */}
        <div className="lg:col-span-5 hidden lg:block space-y-4">
          <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/80">
              <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800 flex items-center gap-1.5">
                📝 Pengeluaran Terakhir (Quick Log)
              </CardTitle>
              <CardDescription className="text-[10px] text-neutral-600 font-medium">
                Daftar 5 pengeluaran kas belanja terakhir yang dicatat secara manual.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-[1.5px] divide-neutral-200">
                {outcomesList.length > 0 ? (
                  outcomesList.map((item) => (
                    <div key={item.id} className="p-3.5 hover:bg-neutral-50/50 transition-colors flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-neutral-850 text-[10px] break-words line-clamp-1 max-w-[150px]">
                          {item.description}
                        </span>
                        <span className="font-black text-red-800 text-[10px] tabular-nums">
                          Rp {formatRupiah(item.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 font-semibold">
                        <span>{formatLocalDate(item.date)}</span>
                        <span className="px-1.5 py-0.2 rounded border border-neutral-300 bg-neutral-50 text-neutral-700 text-[8px] font-black uppercase shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]">
                          {translateCategory(item.category)}
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider mt-1">
                        👤 Belanja oleh: <span className="text-neutral-850">{item.buyer}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400 font-bold italic">
                    Belum ada data pengeluaran kas.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
