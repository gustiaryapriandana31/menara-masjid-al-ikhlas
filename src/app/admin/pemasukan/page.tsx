"use client"

import * as React from "react"
import { Calendar, CircleDollarSign, FileText, Upload, X, Check, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatRupiah, formatTerbilang } from "@/lib/format"
import { createPemasukan } from "./actions"

export default function TambahPemasukanPage() {
  // State Form
  const [amountInput, setAmountInput] = React.useState("")
  const [amount, setAmount] = React.useState<number>(0)
  const [date, setDate] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [donorName, setDonorName] = React.useState("")
  const [donorAddress, setDonorAddress] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [addReceipt, setAddReceipt] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<{ file: File; preview: string }[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

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
  }, [])

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

      // Sukses
      setSuccess(true)
      setAmountInput("")
      setAmount(0)
      setDonorName("")
      setDonorAddress("")
      setDescription("")
      setIsAnonymous(false)
      setAddReceipt(false)
      
      // Bersihkan preview file
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
      setSelectedFiles([])
      
      // Scroll ke atas agar notifikasi sukses terlihat
      window.scrollTo({ top: 0, behavior: 'smooth' })

      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Progress Pembangunan (Neobrutalist Badge) */}
      <div className="w-full border-[2px] border-dashed border-black rounded-full bg-yellow-50 px-4 py-2 flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_0px_#000]">
        <span className="uppercase tracking-wider">Progress Pembangunan</span>
        <div className="flex items-center gap-2">
          {/* Battery-like progress indicator */}
          <div className="w-12 h-4 border-[1.5px] border-black rounded bg-white p-0.5 overflow-hidden flex">
            <div className="h-full bg-emerald-400 rounded-sm" style={{ width: "68%" }} />
          </div>
          <span className="text-sm font-black">68%</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notifikasi Sukses */}
        {success && (
          <div className="flex items-center gap-2 rounded-[14px] border-[2.5px] border-black bg-emerald-100 p-3.5 text-xs text-emerald-900 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold border-[1.5px] border-black text-[10px]">✓</div>
            <span>Pemasukkan berhasil dicatat</span>
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
            <CardTitle className="text-base font-black uppercase tracking-tight text-blue-800">Detail Pemasukan</CardTitle>
            <CardDescription className="text-xs text-neutral-700 font-medium">Catat Pemasukan Kas Untuk Keperluan Pembangunan Menara Masjid Al-Ikhlas.</CardDescription>
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

            {/* Input Alamat Donatur (Kondisional jika tidak anonim) */}
            {!isAnonymous && (
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
            )}

            {/* Input Keterangan / Catatan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <span className="text-blue-600">◆</span> Keterangan / Catatan
              </label>
              <Input
                type="text"
                placeholder="Contoh : Untuk beli semen 50 sak, pasir, dll."
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
                      Jika Ada
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
                  {/* Uploader Icon Yellow Square */}
                  <div className="h-10 w-10 bg-yellow-300 border-[2.5px] border-black rounded-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-2">
                    <Upload className="h-5 w-5 text-black font-bold" />
                  </div>
                  <p className="text-xs font-black text-neutral-800">Klik untuk unggah gambar kuitansi</p>
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
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-[1.5px] border-black hover:bg-red-600 shadow-sm transition-all"
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
            {/* <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-white text-black rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-5 hover:bg-neutral-50"
            >
              Simpan draft
            </Button> */}
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
  )
}
