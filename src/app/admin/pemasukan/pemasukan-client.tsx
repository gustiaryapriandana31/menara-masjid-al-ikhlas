"use client"

import * as React from "react"
import { Calendar, CircleDollarSign, FileText, Upload, X, Check, Image as ImageIcon, Wallet, PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatRupiah, formatTerbilang } from "@/lib/format"
import { useMoneyAnimation } from "@/components/shared/money-animation-provider"
import { createPemasukan } from "./actions"

interface RecentIncome {
  id: string
  donorName: string
  amount: number
  date: string
  type: "CASH" | "TRANSFER"
  description: string
}

interface PemasukanClientProps {
  recentIncomes: RecentIncome[]
}

export default function PemasukanClient({ recentIncomes }: PemasukanClientProps) {
  const { triggerAnimation } = useMoneyAnimation()
  // State Form
  const [amountInput, setAmountInput] = React.useState("")
  const [amount, setAmount] = React.useState<number>(0)
  const [date, setDate] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [donorName, setDonorName] = React.useState("")
  const [donorAddress, setDonorAddress] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [addReceipt, setAddReceipt] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<{ file: File; preview: string }[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Local state to keep track of recent manual incomes for real-time update
  const [incomesList, setIncomesList] = React.useState<RecentIncome[]>(recentIncomes)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  // Format rupiah
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

  // Handle pemilihan file
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

  // Hapus file terpilih
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validasi dasar di sisi Frontend
    if (amount <= 0) {
      setError("Nominal pemasukan harus lebih dari Rp 0.")
      return
    }
    if (!date) {
      setError("Tanggal penerimaan harus diisi.")
      return
    }
    if (!isAnonymous && !donorName.trim()) {
      setError("Nama Donatur harus diisi.")
      return
    }
    if (addReceipt && selectedFiles.length === 0) {
      setError("Silakan unggah minimal satu bukti terima karena Anda mengaktifkan opsi Bukti Terima.")
      return
    }

    setIsSubmitting(true)

    try {
      // Siapkan FormData untuk dikirim ke Server Action
      const formData = new FormData()
      formData.append("amount", amount.toString())
      formData.append("date", date)
      formData.append("donorName", isAnonymous ? "Hamba Allah" : donorName.trim())
      formData.append("donorAddress", isAnonymous ? "" : donorAddress.trim())
      formData.append("donorPhone", isAnonymous ? "" : donorPhone.trim())
      formData.append("description", description.trim())
      formData.append("isAnonymous", isAnonymous ? "true" : "false")
      formData.append("addReceipt", addReceipt ? "true" : "false")

      // Masukkan file-file biner ke FormData
      selectedFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file)
      })

      // Panggil Server Action
      const result = await createPemasukan(null, formData)

      if (!result.success) {
        setError(result.error || "Gagal menyimpan data pemasukan.")
        return
      }

      // Prepend to local quick-log list (max 5)
      const newIncome: RecentIncome = {
        id: result.data?.id || Math.random().toString(),
        donorName: isAnonymous ? "Hamba Allah" : donorName.trim(),
        amount: amount,
        date: new Date(date).toISOString(),
        type: "CASH",
        description: description.trim()
      }
      setIncomesList(prev => [newIncome, ...prev].slice(0, 5))

      // Trigger coin animation
      triggerAnimation("income", amount, isAnonymous ? "Hamba Allah" : donorName.trim())

      // Sukses
      setSuccess(true)
      setAmountInput("")
      setAmount(0)
      setDonorName("")
      setDonorAddress("")
      setDonorPhone("")
      setDescription("")
      setIsAnonymous(false)
      setAddReceipt(false)
      
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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-blue-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <PlusCircle className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Catat Pemasukan Kas</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Input manual penerimaan dana secara Tunai (cash)</p>
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
                <span>Pemasukan berhasil dicatat</span>
              </div>
            )}

            {/* Notifikasi Gagal */}
            {error && (
              <div className="rounded-[14px] border-[2.5px] border-black bg-red-100 p-3.5 text-xs text-red-900 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}

            <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#2563eb] overflow-hidden">
              <CardHeader className="pb-3 border-b-[2.5px] border-black bg-blue-50/50">
                <CardTitle className="text-xs font-black uppercase tracking-tight text-blue-800">Formulir Pemasukan</CardTitle>
                <CardDescription className="text-[10px] text-neutral-700 font-medium">Lengkapi rincian penerimaan kas pembangunan di bawah ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                
                {/* Input Nominal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-blue-600">◆</span> Nominal Transaksi
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-neutral-500 font-black">Rp</span>
                    <Input
                      type="text"
                      placeholder="0"
                      value={amountInput}
                      onChange={handleAmountChange}
                      disabled={isSubmitting}
                      className="pl-9 pr-3 py-5 font-black text-base border-[2.5px] border-black rounded-[12px] bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      required
                    />
                  </div>
                  {amount > 0 ? (
                    <p className="text-[10px] text-blue-700 font-bold italic bg-blue-50/60 border border-blue-200 rounded-md px-2 py-1">
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
                    <span className="text-blue-600">◆</span> Tanggal Penerimaan
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                </div>

                {/* Input Nama Donatur */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-blue-600">◆</span> Nama Donatur
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh : Bpk. Faisal, Bpk. Lukman"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isAnonymous || isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required={!isAnonymous}
                  />

                  {/* Checkbox Anonim / Hamba Allah */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={isAnonymous}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setIsAnonymous(checked)
                        if (checked) {
                          setDonorName("Hamba Allah")
                          setDonorAddress("")
                        } else if (donorName === "Hamba Allah") {
                          setDonorName("")
                        }
                      }}
                      disabled={isSubmitting}
                      className="h-4.5 w-4.5 rounded-[4px] border-[2px] border-black text-blue-600 focus:ring-0 focus:outline-none accent-black bg-white cursor-pointer"
                    />
                    <label htmlFor="isAnonymous" className="text-xs text-neutral-700 select-none cursor-pointer font-bold">
                      Sembunyikan Nama (Gunakan &quot;Hamba Allah&quot;)
                    </label>
                  </div>
                </div>

                {!isAnonymous && (
                  <>
                    <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                      <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <span className="text-blue-600">◆</span> Alamat Donatur
                      </label>
                      <Input
                        type="text"
                        placeholder="Contoh : Dusun I Meranjat II..."
                        value={donorAddress}
                        onChange={(e) => setDonorAddress(e.target.value)}
                        disabled={isSubmitting}
                        className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                      <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <span className="text-blue-600">◆</span> No. Telepon / WhatsApp
                      </label>
                      <Input
                        type="tel"
                        placeholder="Contoh: 0812 3456 7890"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        disabled={isSubmitting}
                        className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                      />
                      <p className="text-[9px] text-neutral-500 font-medium pl-1">
                        Baiknya Diisi. Digunakan apabila panitia perlu menghubungi donatur.
                      </p>
                    </div>
                  </>
                )}

                {/* Input Keterangan / Catatan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-blue-600">◆</span> Keterangan / Catatan
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh : Semen 10 sak, dll."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:shadow-[2px_2px_0px_0px_#2563eb] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                  />
                </div>

                <hr className="border-t-[2.5px] border-black" />

                {/* Checkbox Opsi Bukti Terima */}
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="addReceipt"
                    checked={addReceipt}
                    onChange={(e) => setAddReceipt(e.target.checked)}
                    disabled={isSubmitting}
                    className="h-4.5 w-4.5 rounded-[4px] border-[2px] border-black text-blue-600 focus:ring-0 focus:outline-none accent-black bg-white cursor-pointer"
                  />
                  <label htmlFor="addReceipt" className="text-xs text-neutral-800 select-none cursor-pointer font-black uppercase tracking-tight">
                    Tambahkan Bukti Terima
                  </label>
                </div>

                {/* Bagian Uploader File (Kondisional) */}
                {addReceipt && (
                  <div className="space-y-3 rounded-[16px] border-[2px] border-dashed border-black bg-[#fdfdfd] p-4 animate-in slide-in-from-top-2 duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-neutral-700 uppercase tracking-wider">Dokumen pendukung</span>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold border border-black bg-white px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                          Gambar Bukti
                        </span>
                      </div>
                    </div>

                    {/* Dropzone */}
                    <div 
                      className={cn(
                        "flex flex-col items-center justify-center rounded-[12px] border-[2px] border-dashed border-neutral-400 bg-[#f7f5f0] p-5 text-center transition-colors relative",
                        isSubmitting && "opacity-50"
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
                      <Input
                        type="file"
                        ref={cameraInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        disabled={isSubmitting}
                      />
                      
                      <div className="flex flex-row gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => !isSubmitting && fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase rounded-[8px] border-[1.5px] border-black bg-white hover:bg-neutral-50 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Pilih File
                        </button>
                        <button
                          type="button"
                          onClick={() => !isSubmitting && cameraInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase rounded-[8px] border-[1.5px] border-black bg-amber-300 hover:bg-amber-400 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                        >
                          📷 Ambil Kamera
                        </button>
                      </div>

                      <p className="text-xs font-black text-neutral-800">Klik tombol di atas untuk memilih berkas atau mengambil foto</p>
                      <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">Bisa pilih lebih dari 1 foto.</p>
                    </div>

                    {/* Preview Berkas terpilih */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Berkas terpilih ({selectedFiles.length}):</p>
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
                                title="Hapus gambar"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
              
              <CardFooter className="pt-2 pb-4 border-t-[2.5px] border-black bg-blue-50/20">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-blue-600 text-white rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-5 hover:bg-blue-700 w-full"
                >
                  {isSubmitting ? "Menyimpan..." : "Catat Pemasukan"}
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
                📝 Pemasukan Terakhir (Quick Log)
              </CardTitle>
              <CardDescription className="text-[10px] text-neutral-600 font-medium">
                Daftar 5 pemasukan kas terakhir yang dicatat secara manual.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-[1.5px] divide-neutral-200">
                {incomesList.length > 0 ? (
                  incomesList.map((item) => (
                    <div key={item.id} className="p-3.5 hover:bg-neutral-50/50 transition-colors flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-neutral-800 text-[10px] uppercase tracking-tight truncate max-w-[150px]">
                          {item.donorName}
                        </span>
                        <span className="font-black text-emerald-800 text-[10px] tabular-nums">
                          Rp {formatRupiah(item.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 font-semibold">
                        <span>{formatLocalDate(item.date)}</span>
                        <span className={cn(
                          "px-1.5 py-0.2 rounded border text-[8px] font-black uppercase shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]",
                          item.type === "TRANSFER" ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-amber-50 border-amber-300 text-amber-700"
                        )}>
                          {item.type === "TRANSFER" ? "Transfer" : "Tunai"}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[9px] text-neutral-600 italic bg-neutral-50 rounded px-1.5 py-0.5 border border-neutral-200 truncate mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400 font-bold italic">
                    Belum ada data pemasukan kas.
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
