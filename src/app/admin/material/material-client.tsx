"use client"

import * as React from "react"
import { Package, Calendar, Upload, X, Check, Image as ImageIcon, PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMoneyAnimation } from "@/components/shared/money-animation-provider"
import { createMaterialDonation } from "./actions"

interface RecentMaterial {
  id: string
  donorName: string
  materialName: string
  quantity: string
  date: string
  description: string
}

interface MaterialClientProps {
  recentMaterials: RecentMaterial[]
}

export default function MaterialClient({ recentMaterials }: MaterialClientProps) {
  const { triggerAnimation } = useMoneyAnimation()

  // ── Form State ──────────────────────────────────────────────────────────────
  const [date, setDate] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [donorName, setDonorName] = React.useState("")
  const [donorAddress, setDonorAddress] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [materialName, setMaterialName] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [addReceipt, setAddReceipt] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<{ file: File; preview: string }[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Local state for quick log
  const [materialsList, setMaterialsList] = React.useState<RecentMaterial[]>(recentMaterials)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  // ── File Handling ───────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles: { file: File; preview: string }[] = []

      for (const file of filesArray) {
        if (file.size > 10 * 1024 * 1024) {
          setError(`Berkas "${file.name}" terlalu besar. Ukuran maksimal adalah 10MB.`)
          return
        }
        if (!file.type.startsWith("image/")) {
          setError(`Berkas "${file.name}" tidak valid. Hanya gambar (JPG/PNG/WebP) yang diperbolehkan.`)
          return
        }
        validFiles.push({ file, preview: URL.createObjectURL(file) })
      }
      setSelectedFiles(prev => [...prev, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  // ── Format Date ─────────────────────────────────────────────────────────────
  const formatLocalDate = (isoStr: string) => {
    if (!isoStr) return "-"
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return "-"
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!materialName.trim()) {
      setError("Nama material tidak boleh kosong.")
      return
    }
    if (!quantity.trim()) {
      setError("Jumlah/volume material tidak boleh kosong.")
      return
    }
    if (!isAnonymous && !donorName.trim()) {
      setError("Nama donatur tidak boleh kosong.")
      return
    }
    if (isAnonymous && donorName.trim() === "" && !isAnonymous) {
      setError("Nama donatur tidak boleh kosong.")
      return
    }
    if (addReceipt && selectedFiles.length === 0) {
      setError("Silakan unggah minimal satu foto dokumentasi.")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("donorName", isAnonymous ? "Hamba Allah" : donorName.trim())
      formData.append("isAnonymous", isAnonymous ? "true" : "false")
      formData.append("donorAddress", donorAddress.trim())
      formData.append("donorPhone", donorPhone.trim())
      formData.append("materialName", materialName.trim())
      formData.append("quantity", quantity.trim())
      formData.append("date", date)
      formData.append("description", description.trim())
      formData.append("addReceipt", addReceipt ? "true" : "false")

      selectedFiles.forEach(({ file }) => formData.append("files", file))

      const result = await createMaterialDonation(null, formData)

      if (!result.success) {
        setError(result.error || "Gagal menyimpan data donasi material.")
        return
      }

      // Prepend to local quick-log
      const newMaterial: RecentMaterial = {
        id: result.data?.id || Math.random().toString(),
        donorName: isAnonymous ? "Hamba Allah" : donorName.trim(),
        materialName: materialName.trim(),
        quantity: quantity.trim(),
        date: new Date(date).toISOString(),
        description: description.trim(),
      }
      setMaterialsList(prev => [newMaterial, ...prev].slice(0, 7))

      // Trigger coin animation
      triggerAnimation("income", 0, isAnonymous ? "Hamba Allah" : donorName.trim())

      // Reset form
      setSuccess(true)
      setDonorName("")
      setDonorAddress("")
      setDonorPhone("")
      setMaterialName("")
      setQuantity("")
      setDescription("")
      setIsAnonymous(false)
      setAddReceipt(false)
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
      setSelectedFiles([])
      window.scrollTo({ top: 0, behavior: "smooth" })
      setTimeout(() => setSuccess(false), 4000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border-[2px] border-black bg-amber-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Package className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight text-neutral-800">Catat Donasi Material</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Input manual penerimaan donasi berupa barang / material</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-3 rounded-[14px] border-[2.5px] border-emerald-700 bg-emerald-50 px-4 py-3 shadow-[3px_3px_0px_0px_rgba(0,100,0,0.5)]">
          <Check className="h-5 w-5 shrink-0 text-emerald-700" />
          <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">
            Donasi material berhasil dicatat!
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-[14px] border-[2.5px] border-red-500 bg-red-50 px-4 py-3 shadow-[3px_3px_0px_0px_rgba(200,0,0,0.3)]">
          <p className="text-xs font-black text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="shrink-0 text-red-500 hover:text-red-700 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grid: Form (left) + Quick Log (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Form ────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit}>
            <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardHeader className="pb-4 border-b-[2.5px] border-black bg-neutral-50/80">
                <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800 flex items-center gap-1.5">
                  <span className="text-amber-500">📦</span> Formulir Donasi Material
                </CardTitle>
                <CardDescription className="text-[10px] text-neutral-600 font-medium">
                  Lengkapi rincian penerimaan material pembangunan di bawah ini.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-5">

                {/* Material Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Nama Material <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Misal: Semen Tiga Roda, Pasir Urug, Besi Beton 10mm"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Jumlah / Volume <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Misal: 30 sak, 1 truk pasir, 50 batang besi"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    required
                  />
                  <p className="text-[9px] text-neutral-400 font-medium">Tulis bebas, termasuk satuan (sak, truk, batang, lembar, dll).</p>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Tanggal Penerimaan
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={isSubmitting}
                      className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Donor Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Nama Donatur
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Bpk. Faisal, Kel. H. Ahmad"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isSubmitting || isAnonymous}
                    className={cn(
                      "font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm",
                      isAnonymous && "opacity-50 cursor-not-allowed bg-neutral-50"
                    )}
                  />
                  {/* Anonymous checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer w-fit mt-1">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-3.5 w-3.5 rounded border-[1.5px] border-black accent-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-neutral-700">Sembunyikan Nama (Gunakan "Hamba Allah")</span>
                  </label>
                </div>

                {/* Donor Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Alamat Donatur
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Dusun I Meranjat II..."
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                  />
                </div>

                {/* Donor Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> No. Telepon / WhatsApp
                  </label>
                  <Input
                    type="tel"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="text-amber-500">◆</span> Keterangan / Catatan
                  </label>
                  <Input
                    type="text"
                    placeholder="Misal: untuk pondasi kolom utama, dll."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    className="font-medium border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-amber-500 focus-visible:shadow-[2px_2px_0px_0px_#f59e0b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                  />
                </div>

                {/* Upload Bukti Dokumentasi */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={addReceipt}
                      onChange={(e) => {
                        setAddReceipt(e.target.checked)
                        if (!e.target.checked) {
                          selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
                          setSelectedFiles([])
                        }
                      }}
                      disabled={isSubmitting}
                      className="h-3.5 w-3.5 rounded border-[1.5px] border-black accent-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
                      Tambahkan Bukti Dokumentasi / Nota
                    </span>
                  </label>

                  {addReceipt && (
                    <div className="space-y-3 pt-1">
                      {/* Preview thumbnails */}
                      {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedFiles.map((fileObj, index) => (
                            <div key={index} className="relative group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={fileObj.preview}
                                alt={`Preview ${index + 1}`}
                                className="h-16 w-16 rounded-[8px] border-[2px] border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full border-[1.5px] border-black bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload buttons */}
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center rounded-[12px] border-[2px] border-dashed border-neutral-400 bg-[#f7f5f0] p-5 text-center transition-colors relative",
                          isSubmitting && "opacity-50 pointer-events-none"
                        )}
                      >
                        <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Foto dokumentasi / nota sumbangan</p>
                        <p className="text-[9px] text-neutral-400 mt-0.5">JPG, PNG, WebP — Maks. 10MB per file</p>

                        <div className="flex gap-2 mt-3 flex-wrap justify-center">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase rounded-[8px] border-[1.5px] border-black bg-amber-300 hover:bg-amber-400 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5" /> Pilih dari Galeri
                          </button>
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase rounded-[8px] border-[1.5px] border-black bg-white hover:bg-neutral-100 shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                          >
                            📷 Ambil Foto
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>

              <CardFooter className="px-5 pb-5 pt-0">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-amber-500 text-black rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-5 hover:bg-amber-400 w-full"
                >
                  {isSubmitting ? "Menyimpan..." : "Catat Donasi Material"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* ── Quick Log (Right Column, Desktop Only) ─────────────────────────── */}
        <div className="lg:col-span-5 hidden lg:block space-y-4">
          <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <CardHeader className="pb-3 border-b-[2.5px] border-black bg-neutral-50/80">
              <CardTitle className="text-xs font-black uppercase tracking-tight text-neutral-800 flex items-center gap-1.5">
                📦 Material Terakhir (Quick Log)
              </CardTitle>
              <CardDescription className="text-[10px] text-neutral-600 font-medium">
                Daftar 7 donasi material terbaru (berdasarkan tanggal).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-[1.5px] divide-neutral-200">
                {materialsList.length > 0 ? (
                  materialsList.map((item) => (
                    <div key={item.id} className="p-3.5 hover:bg-neutral-50/50 transition-colors flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-black text-neutral-800 text-[10px] uppercase tracking-tight truncate max-w-[140px]">
                          {item.donorName}
                        </span>
                        <span className="shrink-0 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-400 bg-amber-50 text-amber-800 shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]">
                          Material
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-amber-700 truncate">
                        {item.materialName}
                        <span className="text-neutral-400 ml-1">— {item.quantity}</span>
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 font-semibold">
                        <span>{formatLocalDate(item.date)}</span>
                      </div>
                      {item.description && (
                        <p className="text-[9px] text-neutral-600 italic bg-neutral-50 rounded px-1.5 py-0.5 border border-neutral-200 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400 font-bold italic">
                    Belum ada data donasi material.
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
