"use client"

import * as React from "react"
import { Calendar, Heart, FileText, Upload, X, ArrowLeft, Building2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatRupiah, formatTerbilang } from "@/lib/format"
import { useMoneyAnimation } from "@/components/shared/money-animation-provider"
import { createDonationConfirmation } from "./actions"

// Helper component for bank logo image
const BankLogoImg = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className="h-6 w-auto object-contain" />
)

// Define payment channels with real logo images
const paymentChannels = [
  {
    value: "SUMSEL_BABEL_SYARIAH",
    label: "Bank SumSel Babel Syariah",
    logo: <BankLogoImg src="/logos/sumsel_babel.png" alt="Bank Sumsel Babel Syariah" />
  },
  {
    value: "BSI",
    label: "Bank Syariah Indonesia (BSI)",
    logo: <BankLogoImg src="/logos/bsi.png" alt="BSI" />
  },
  {
    value: "MANDIRI",
    label: "Bank Mandiri",
    logo: <BankLogoImg src="/logos/mandiri.png" alt="Bank Mandiri" />
  },
  {
    value: "BCA",
    label: "Bank BCA",
    logo: <BankLogoImg src="/logos/bca.png" alt="Bank BCA" />
  },
  {
    value: "BRI",
    label: "Bank BRI",
    logo: <BankLogoImg src="/logos/bri.png" alt="Bank BRI" />
  },
  {
    value: "BNI",
    label: "Bank BNI",
    logo: <BankLogoImg src="/logos/bni.png" alt="Bank BNI" />
  },
  {
    value: "QRIS",
    label: "QRIS (GPN Scan)",
    logo: <BankLogoImg src="/logos/qris.png" alt="QRIS" />
  },
  {
    value: "OTHER",
    label: "Lainnya / Saluran Lain",
    logo: (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-200 border border-neutral-400 text-neutral-800 font-bold text-[10px] uppercase">
        <Building2 className="h-3 w-3" />
        <span>Lainnya</span>
      </div>
    )
  }
]

export default function KonfirmasiDonasiPage() {
  const { triggerAnimation } = useMoneyAnimation()
  // State Form
  const [donorName, setDonorName] = React.useState("")
  const [donorAddress, setDonorAddress] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [amountInput, setAmountInput] = React.useState("")
  const [amount, setAmount] = React.useState<number>(0)
  const [transferDate, setTransferDate] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [paymentChannel, setPaymentChannel] = React.useState("")
  const [customPaymentChannel, setCustomPaymentChannel] = React.useState("")
  const [selectedFiles, setSelectedFiles] = React.useState<{ file: File; preview: string }[]>([])
  
  // Submit state
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // References & dropdown
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Smooth scroll ke area formulir
  const scrollToForm = () => {
    const element = document.getElementById("form-konfirmasi")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Copy to clipboard handler
  const [isCopied, setIsCopied] = React.useState(false)
  const handleCopyRekening = async () => {
    try {
      await navigator.clipboard.writeText("8290900017")
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Gagal menyalin rekening: ", err)
    }
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle amount formatting
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

  // Handle file select with 10MB limit
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

  // Remove selected file
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Form validations
    if (!donorName.trim()) {
      setError("Silakan masukkan nama donatur.")
      return
    }
    if (amount <= 0) {
      setError("Nominal donasi harus lebih dari Rp 0.")
      return
    }
    if (!transferDate) {
      setError("Silakan tentukan tanggal transfer.")
      return
    }
    if (!paymentChannel) {
      setError("Silakan pilih media pembayaran.")
      return
    }
    if (paymentChannel === "OTHER" && !customPaymentChannel.trim()) {
      setError("Silakan isi nama saluran transfer yang Anda gunakan.")
      return
    }
    if (selectedFiles.length === 0) {
      setError("Silakan unggah minimal satu foto bukti transfer/pengiriman.")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("donorName", donorName.trim())
      formData.append("donorAddress", donorAddress.trim())
      formData.append("donorPhone", donorPhone.trim())
      formData.append("isAnonymous", isAnonymous.toString())
      formData.append("amount", amount.toString())
      formData.append("transferDate", transferDate)
      // Jika OTHER, kirim custom text; jika tidak, kirim nilai channel yang dipilih
      formData.append("paymentChannel", paymentChannel === "OTHER" ? customPaymentChannel.trim() : paymentChannel)

      selectedFiles.forEach((fileObj) => {
        formData.append("files", fileObj.file)
      })

      const result = await createDonationConfirmation(null, formData)

      if (!result.success) {
        setError(result.error || "Gagal menyimpan konfirmasi donasi.")
        return
      }

      // Trigger money animation
      triggerAnimation("income", amount, isAnonymous ? "Hamba Allah" : donorName.trim())

      // Reset form
      setDonorName("")
      setDonorAddress("")
      setDonorPhone("")
      setIsAnonymous(false)
      setAmountInput("")
      setAmount(0)
      setPaymentChannel("")
      setCustomPaymentChannel("")
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview))
      setSelectedFiles([])
      
      // Delay success banner until animation closes
      setTimeout(() => {
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim konfirmasi donasi. Coba beberapa saat lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 pb-20 font-sans">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex items-center gap-1 border-[1.5px] border-black bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-[1.5px_1.5px_0px_0px_#000] transition-all">
          <ArrowLeft className="h-3 w-3" />
          <span>Kembali</span>
        </Link>
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full border border-black object-cover" />
          <span className="text-sm font-black tracking-tight uppercase">Menara Al-Ikhlas</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 w-full max-w-4xl lg:max-w-5xl mx-auto animate-in fade-in duration-300 pb-24">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* KOLOM KIRI (md:col-span-5) - QRIS & INFORMASI REKENING */}
          <div className="md:col-span-5 space-y-4">
            <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardHeader className="pb-3 border-b-[2.5px] border-black bg-amber-50/50">
                <CardTitle className="text-xs font-black uppercase tracking-tight text-amber-900">✨ Pindai QRIS / Transfer</CardTitle>
                <CardDescription className="text-[10px] text-neutral-700 font-medium">Salurkan infaq/donasi terbaik Anda melalui saluran resmi di bawah ini.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">

                {/* QRIS Option Label */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-[8px] font-black uppercase bg-sky-500 text-white border border-black px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">Opsi QRIS</span>
                  <span className="text-[10px] text-neutral-600 font-semibold leading-tight">Scan kode QR di bawah jika ingin donasi via GPN/QRIS</span>
                </div>

                {/* QRIS Image */}
                <div className="relative group rounded-[16px] border-[2.5px] border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-w-[220px] mx-auto transition-transform hover:scale-102">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qris-masjid.png" alt="QRIS Masjid Al-Ikhlas" className="object-contain w-full h-auto rounded-[10px]" />
                </div>

                {/* Divider with label */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t-[2px] border-black" />
                  <span className="text-[9px] font-black uppercase text-neutral-500">atau</span>
                  <div className="flex-1 border-t-[2px] border-black" />
                </div>

                {/* Rekening Option Label */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-[8px] font-black uppercase bg-amber-400 text-neutral-900 border border-black px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">Opsi Transfer</span>
                  <span className="text-[10px] text-neutral-600 font-semibold leading-tight">Transfer ke no. rekening di bawah jika ingin via bank</span>
                </div>
                
                {/* Rekening Info */}
                <div className="space-y-3 bg-[#fffbeb] border-[2px] border-black p-4 rounded-[16px] shadow-[2.5px_2.5px_0px_0px_#ca8a04] text-[10px] font-bold text-neutral-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5 border-b border-amber-200 pb-1.5">
                    📌 Rekening Resmi
                  </h4>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-amber-800 uppercase block">Bank Sumsel Babel Syariah</span>
                    
                    {/* Copyable Rekening Box */}
                    <div className="flex items-center gap-1.5 bg-white border-[1.5px] border-black rounded-[10px] p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
                      <span className="flex-1 text-sm font-black text-neutral-950 pl-2.5 tracking-wider select-all">
                        829-09-00017
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRekening}
                        className={cn(
                          "px-2.5 py-1.5 text-[9px] font-black uppercase rounded-[6px] border border-black transition-all flex items-center gap-1 shrink-0 cursor-pointer",
                          isCopied 
                            ? "bg-emerald-500 text-white shadow-none translate-x-[1px] translate-y-[1px]" 
                            : "bg-amber-300 hover:bg-amber-405 text-neutral-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        )}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 shrink-0" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 shrink-0" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[9px] text-neutral-500 block leading-tight font-medium pl-1 text-center">
                      a.n. Infaq Pembangunan Masjid Al-Ikhlas
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smooth Scroll Button */}
            <Button
              type="button"
              onClick={scrollToForm}
              className="w-full text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-amber-400 hover:bg-amber-500 text-black rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-4.5 flex items-center justify-center gap-2"
            >
              ✍️ Konfirmasi Donasi (Isi Form)
            </Button>
          </div>

          {/* KOLOM KANAN (md:col-span-7) - FORMULIR KONFIRMASI */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Banner Syiar */}
            <div className="w-full border-[2.5px] border-black rounded-[18px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 text-white shadow-[4px_4px_0px_0px_#ca8a04]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-amber-400 border border-black rounded-md text-emerald-950">
                  <Heart className="h-4 w-4 fill-amber-950" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Amalan Jariyah</span>
              </div>
              <h2 className="text-sm font-extrabold leading-tight">
                Pencatatan Konfirmasi Donasi
              </h2>
              <p className="text-[10px] text-emerald-100/90 font-medium mt-1">
                Silakan lengkapi formulir di bawah ini untuk melaporkan donasi transfer bank atau scan QRIS Anda agar divalidasi oleh panitia.
              </p>
            </div>

            {/* Notifikasi Sukses */}
            {success && (
              <div className="flex flex-col gap-2 rounded-[18px] border-[2.5px] border-black bg-amber-50 p-4 text-xs font-bold shadow-[4px_4px_0px_0px_#047857] animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold border-[1.5px] border-black text-[11px]">✓</div>
                  <span className="text-emerald-900 text-sm font-black uppercase">Syukron Jazakallah Khair Bapak/Ibu Donatur</span>
                </div>
                <p className="text-neutral-700 font-medium pl-8 text-[11px]">
                  Alhamdulillah, konfirmasi donasi yang Anda berikan sudah kami terima, panitia akan melakukan pengecekan terhadap donasi tersebut. Semoga Allah melipatgandakan rezeki Bapak/Ibu Saudara Sekalian.
                </p>
                <div className="pl-8 pt-1">
                  <Button 
                    onClick={() => setSuccess(false)}
                    className="text-[10px] font-extrabold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-[1.5px] border-black rounded-lg shadow-[2px_2px_0px_0px_#000] h-auto"
                  >
                    Aamiin yaa Rabbal&apos;aalamiin
                  </Button>
                </div>
              </div>
            )}

            {/* Notifikasi Gagal */}
            {error && (
              <div className="rounded-[18px] border-[2.5px] border-black bg-red-100 p-4 text-xs text-red-900 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in shake duration-200">
                <p className="font-extrabold uppercase text-[10px] text-red-800 mb-1">Terjadi Kesalahan</p>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Form Card */}
            <form id="form-konfirmasi" onSubmit={handleSubmit} className="space-y-4 scroll-mt-20">
              <Card className="bg-white border-[2.5px] border-black rounded-[18px] shadow-[4px_4px_0px_0px_#047857] overflow-hidden">
                <CardHeader className="pb-3 border-b-[2.5px] border-black bg-emerald-50/50">
                  <CardTitle className="text-base font-black uppercase tracking-tight text-emerald-800">Form Konfirmasi Donasi</CardTitle>
                  <CardDescription className="text-xs text-neutral-700 font-medium">Bantu transparansi kas pembangunan dengan mengirimkan bukti transfer Anda.</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-4">
                  
                  {/* Field: Nama Donatur */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="text-emerald-600">◆</span> Nama Donatur / Pendonasi
                    </label>
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap Anda..."
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      disabled={isAnonymous || isSubmitting}
                      className="font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                      required={!isAnonymous}
                    />

                    {/* Checkbox Hamba Allah */}
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
                        className="h-4.5 w-4.5 rounded-[4px] border-[2px] border-black text-emerald-600 focus:ring-0 focus:outline-none accent-black bg-white cursor-pointer"
                      />
                      <label htmlFor="isAnonymous" className="text-xs text-neutral-700 select-none cursor-pointer font-bold">
                        Sembunyikan Nama (Gunakan &quot;Hamba Allah&quot;)
                      </label>
                    </div>
                  </div>

                  {/* Field: Alamat Donatur (Kondisional) */}
                  {!isAnonymous && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                      <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <span className="text-emerald-600">◆</span> Alamat Donatur
                      </label>
                      <Input
                        type="text"
                        placeholder="Contoh : Dusun I Meranjat II..."
                        value={donorAddress}
                        onChange={(e) => setDonorAddress(e.target.value)}
                        disabled={isSubmitting}
                        className="font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                      />
                    </div>
                  )}

                  {/* Field: Nomor Telepon / WA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="text-emerald-600">◆</span> No. Telepon / WhatsApp
                    </label>
                    <Input
                      type="tel"
                      placeholder="Contoh: 0812 3456 7890"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      disabled={isSubmitting}
                      className="font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                    />
                    <p className="text-[10px] text-neutral-500 font-medium pl-1 flex items-start gap-1">
                      <span className="shrink-0">📞</span>
                      <span>Digunakan panitia apabila perlu menghubungi Anda terkait konfirmasi donasi ini. (Mohon berkenan diisi)</span>
                    </p>
                  </div>

                  {/* Field: Nominal Donasi */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="text-emerald-600">◆</span> Jumlah Nominal Donasi
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-neutral-500 font-black">Rp</span>
                      <Input
                        type="text"
                        placeholder="0"
                        value={amountInput}
                        onChange={handleAmountChange}
                        disabled={isSubmitting}
                        className="pl-9 pr-3 py-5 font-black text-base border-[2.5px] border-black rounded-[12px] bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        required
                      />
                    </div>
                    {amount > 0 ? (
                      <p className="text-[10px] text-emerald-800 font-bold italic bg-emerald-50/70 border border-emerald-200 rounded-md px-2.5 py-1 animate-in fade-in duration-200">
                        Terbilang: {formatTerbilang(amount)}
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground font-medium pl-1">
                        Tuliskan jumlah dana yang telah Anda transfer.
                      </p>
                    )}
                  </div>

                  {/* Field: Tanggal Transfer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="text-emerald-600">◆</span> Tanggal Transfer
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Field: Media Pembayaran Dropdown */}
                  <div className="space-y-1.5" ref={dropdownRef}>
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="text-emerald-600">◆</span> Saluran / Media Pembayaran
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isSubmitting}
                        className="flex h-11 w-full items-center justify-between rounded-[12px] border-[2.5px] border-black bg-white px-3 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed text-left text-foreground cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {paymentChannel ? (
                            <>
                              <div className="flex shrink-0">
                                {paymentChannels.find(p => p.value === paymentChannel)?.logo}
                              </div>
                              <span>
                                {paymentChannels.find(p => p.value === paymentChannel)?.label}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted-foreground font-medium">-- Pilih Saluran Transfer --</span>
                          )}
                        </div>
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
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border-[2.5px] border-black rounded-[12px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-64 overflow-y-auto animate-in slide-in-from-top-1 duration-150">
                          {paymentChannels.map((channel) => (
                            <button
                              key={channel.value}
                              type="button"
                              onClick={() => {
                                setPaymentChannel(channel.value)
                                setIsDropdownOpen(false)
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2.5 text-xs font-bold border-b-[1.5px] border-black last:border-b-0 transition-colors flex items-center justify-between cursor-pointer",
                                paymentChannel === channel.value 
                                  ? "bg-emerald-50 text-emerald-800" 
                                  : "hover:bg-neutral-50 text-neutral-800"
                              )}
                            >
                              <span>{channel.label}</span>
                              <div className="scale-90 origin-right shrink-0">
                                {channel.logo}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input custom saluran jika pilih Lainnya */}
                  {paymentChannel === "OTHER" && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <span className="text-emerald-600">◆</span> Nama Saluran Transfer
                      </label>
                      <Input
                        type="text"
                        placeholder="Contoh: BPD Sumsel, Tunai, Virtual Account, dll..."
                        value={customPaymentChannel}
                        onChange={(e) => setCustomPaymentChannel(e.target.value)}
                        disabled={isSubmitting}
                        className="font-bold border-[2.5px] border-black rounded-[12px] h-10 px-3 bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-600 focus-visible:shadow-[2px_2px_0px_0px_#047857] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
                        autoFocus
                        required
                      />
                      <p className="text-[10px] text-muted-foreground font-medium pl-1">
                        Tuliskan nama bank atau metode pembayaran yang Anda gunakan.
                      </p>
                    </div>
                  )}

                  <hr className="border-t-[2px] border-black" />

                  {/* Field: Upload Bukti Transfer */}
                  <div className="space-y-3 rounded-[16px] border-[2px] border-dashed border-black bg-[#fdfdfd] p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Unggah Bukti Kirim</label>
                      <div className="flex gap-1.5">
                        <span className="text-[8px] font-bold border border-black bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]">
                          Mendukung {">"}1 Foto
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
                      <p className="text-[9px] text-muted-foreground mt-0.5">Mendukung unggahan berkas m-banking, struk ATM, atau foto bukti fisik.</p>
                    </div>

                    {/* File Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-neutral-700 uppercase tracking-wider">Berkas Terpilih ({selectedFiles.length}):</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedFiles.map((fileObj, idx) => (
                            <div key={idx} className="relative group rounded-[10px] border-[2px] border-black bg-white p-1 h-16 w-full flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={fileObj.preview}
                                alt={`Bukti ${idx + 1}`}
                                className="object-cover h-full w-full rounded-[6px]"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-[1.5px] border-black hover:bg-red-600 shadow-sm transition-all cursor-pointer"
                                title="Hapus Bukti"
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

                <CardFooter className="pt-2 pb-4 border-t-[2.5px] border-black bg-emerald-50/10 px-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-xs font-black uppercase tracking-wider border-[2.5px] border-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all py-5 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Mengirim Konfirmasi...</>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 fill-white shrink-0 animate-pulse" />
                        Kirim Konfirmasi Donasi
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
          
        </div>

      </main>
    </div>
  )
}
