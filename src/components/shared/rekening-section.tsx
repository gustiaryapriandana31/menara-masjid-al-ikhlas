"use client"

import * as React from "react"
import { Heart, MessageCircle, Banknote, Copy, Check } from "lucide-react"

interface RekeningCardProps {
  bankName: string
  accountNumber: string
  accountName: string
  purpose: string
  colorScheme: "yellow" | "blue"
  badge: string
}

function RekeningCard({ bankName, accountNumber, accountName, purpose, colorScheme, badge }: RekeningCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback untuk browser lama
      const el = document.createElement("textarea")
      el.value = accountNumber
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isYellow = colorScheme === "yellow"

  return (
    <div className={`relative border-[2.5px] sm:border-[3px] border-black rounded-[18px] sm:rounded-[22px] shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] overflow-hidden ${isYellow ? "bg-amber-400" : "bg-blue-500"}`}>
      {/* Header */}
      <div className={`border-b-[2.5px] sm:border-b-[3px] border-black px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 ${isYellow ? "bg-amber-500" : "bg-blue-600"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-[2px] border-black bg-white flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
            <Banknote className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isYellow ? "text-amber-700" : "text-blue-700"}`} />
          </div>
          <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wide truncate ${isYellow ? "text-amber-950" : "text-white"}`}>
            {bankName}
          </span>
        </div>
        <span className={`text-[8px] sm:text-[9px] font-black uppercase bg-black px-2 py-0.5 rounded-full shrink-0 ${isYellow ? "text-amber-400" : "text-blue-400"}`}>
          {badge}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div>
          <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider mb-1.5 sm:mb-2 ${isYellow ? "text-amber-900/70" : "text-blue-100/80"}`}>
            Nomor Rekening
          </p>
          {/* Nomor rekening + tombol salin */}
          <div className={`flex items-center justify-between gap-2 border-[2px] border-black rounded-[12px] p-2.5 sm:px-4 sm:py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isYellow ? "bg-white/35" : "bg-white/20"}`}>
            <span className={`text-sm xs:text-base sm:text-lg md:text-xl font-black font-mono tracking-tight sm:tracking-wider select-all break-all min-w-0 ${isYellow ? "text-amber-950" : "text-white"}`}>
              {accountNumber}
            </span>
            <button
              onClick={handleCopy}
              type="button"
              title="Salin nomor rekening"
              className={`shrink-0 flex items-center gap-1 sm:gap-1.5 rounded-[8px] border-[2px] border-black px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-white border-emerald-700"
                  : isYellow
                    ? "bg-white text-amber-900 hover:bg-amber-100"
                    : "bg-white text-blue-900 hover:bg-blue-100"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 shrink-0" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 shrink-0" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px]">
          <div className={`border-[1.5px] border-black rounded-[10px] p-2 sm:p-2.5 ${isYellow ? "bg-white/35" : "bg-white/20"}`}>
            <p className={`text-[7.5px] sm:text-[8px] font-black uppercase mb-0.5 ${isYellow ? "text-amber-900/60" : "text-blue-100/70"}`}>Atas Nama</p>
            <p className={`font-black text-[10px] sm:text-[11px] leading-tight break-words ${isYellow ? "text-amber-950" : "text-white"}`}>{accountName}</p>
          </div>
          <div className={`border-[1.5px] border-black rounded-[10px] p-2 sm:p-2.5 ${isYellow ? "bg-white/35" : "bg-white/20"}`}>
            <p className={`text-[7.5px] sm:text-[8px] font-black uppercase mb-0.5 ${isYellow ? "text-amber-900/60" : "text-blue-100/70"}`}>Peruntukan</p>
            <p className={`font-black text-[10px] sm:text-[11px] leading-tight break-words ${isYellow ? "text-amber-950" : "text-white"}`}>{purpose}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RekeningSection() {
  return (
    <section id="donasi" className="w-full bg-neutral-900 border-y-[3px] border-black py-12 sm:py-16 px-3.5 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">

        {/* Heading */}
        <div className="text-center space-y-2.5 sm:space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-amber-400 bg-amber-400/10 text-amber-300 px-3.5 py-1 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#f59e0b]">
            <Heart className="h-3 w-3 fill-amber-300" /> Cara Berdonasi
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            Transfer Donasi Anda
          </h2>
          <p className="text-xs text-neutral-400 font-medium max-w-lg mx-auto leading-relaxed">
            Donasikan untuk pembangunan Menara Masjid Al-Ikhlas melalui rekening berikut. Setiap rupiah akan dicatat secara transparan.
          </p>
        </div>

        {/* Dua Card Rekening */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <RekeningCard
            bankName="Bank Sumsel Babel"
            accountNumber="8290900017"
            accountName="Masjid Al-Ikhlas Desa Meranjat II"
            purpose="Rekening Kas Masjid"
            colorScheme="yellow"
            badge="Rekening Masjid"
          />
          <RekeningCard
            bankName="Bank BRI"
            accountNumber="563701060006539"
            accountName="Panitia Pembangunan Menara"
            purpose="Dana Pembangunan Menara"
            colorScheme="blue"
            badge="Rekening Pembangunan"
          />
        </div>

        {/* Konfirmasi via WA */}
        <div className="border-[2.5px] border-black bg-neutral-800 rounded-[18px] sm:rounded-[20px] p-4 sm:p-6 shadow-[3px_3px_0px_0px_#10b981] sm:shadow-[4px_4px_0px_0px_#10b981] space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2.5 sm:gap-3 border-b border-neutral-700 pb-2.5 sm:pb-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black uppercase text-white truncate">Sudah Transfer?</p>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 font-medium leading-tight">Konfirmasi bukti transfer ke nomor WhatsApp panitia berikut:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <a
              href="https://wa.me/6281377884175"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 sm:gap-3 border-[2px] border-black bg-neutral-700/80 hover:bg-emerald-900/60 rounded-[12px] sm:rounded-[14px] p-2.5 sm:p-3.5 transition-all shadow-[2px_2px_0px_0px_#10b981] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[7.5px] sm:text-[8px] font-black uppercase text-emerald-400 tracking-wider">Ketua Pembangunan</p>
                <p className="text-[11px] sm:text-xs font-black text-white leading-tight truncate">Bapak Candra Gunawan</p>
                <p className="text-[10px] font-bold text-neutral-300 tracking-wider">0813-7788-4175</p>
              </div>
            </a>

            <a
              href="https://wa.me/6281278256470"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 sm:gap-3 border-[2px] border-black bg-neutral-700/80 hover:bg-emerald-900/60 rounded-[12px] sm:rounded-[14px] p-2.5 sm:p-3.5 transition-all shadow-[2px_2px_0px_0px_#10b981] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[7.5px] sm:text-[8px] font-black uppercase text-emerald-400 tracking-wider">Ketua DKM</p>
                <p className="text-[11px] sm:text-xs font-black text-white leading-tight truncate">Ustadz Ramlan</p>
                <p className="text-[10px] font-bold text-neutral-300 tracking-wider">0812-7825-6470</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
