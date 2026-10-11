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
    <div className={`relative border-[3px] border-black rounded-[22px] shadow-[6px_6px_0px_0px_#000] overflow-hidden ${isYellow ? "bg-amber-400" : "bg-blue-500"}`}>
      {/* Header */}
      <div className={`border-b-[3px] border-black px-5 py-3 flex items-center justify-between ${isYellow ? "bg-amber-500" : "bg-blue-600"}`}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border-[2px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <Banknote className={`h-4 w-4 ${isYellow ? "text-amber-700" : "text-blue-700"}`} />
          </div>
          <span className={`text-xs font-black uppercase tracking-wide ${isYellow ? "text-amber-950" : "text-white"}`}>
            {bankName}
          </span>
        </div>
        <span className={`text-[9px] font-black uppercase bg-black px-2 py-0.5 rounded-full ${isYellow ? "text-amber-400" : "text-blue-400"}`}>
          {badge}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <p className={`text-[9px] font-black uppercase tracking-wider mb-2 ${isYellow ? "text-amber-900/70" : "text-blue-100/80"}`}>
            Nomor Rekening
          </p>
          {/* Nomor rekening + tombol salin */}
          <div className={`flex items-center gap-3 border-[2px] border-black rounded-[12px] px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isYellow ? "bg-white/30" : "bg-white/20"}`}>
            <span className={`text-xl font-black tracking-widest flex-1 select-all ${isYellow ? "text-amber-950" : "text-white"}`}>
              {accountNumber}
            </span>
            <button
              onClick={handleCopy}
              title="Salin nomor rekening"
              className={`shrink-0 flex items-center gap-1.5 rounded-[8px] border-[2px] border-black px-2.5 py-1.5 text-[10px] font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                copied
                  ? "bg-emerald-500 text-white border-emerald-700"
                  : isYellow
                    ? "bg-white text-amber-900 hover:bg-amber-100"
                    : "bg-white text-blue-900 hover:bg-blue-100"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Salin
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className={`border-[1.5px] border-black rounded-[10px] p-2.5 ${isYellow ? "bg-white/30" : "bg-white/20"}`}>
            <p className={`text-[8px] font-black uppercase mb-0.5 ${isYellow ? "text-amber-900/60" : "text-blue-100/70"}`}>Atas Nama</p>
            <p className={`font-black leading-tight ${isYellow ? "text-amber-950" : "text-white"}`}>{accountName}</p>
          </div>
          <div className={`border-[1.5px] border-black rounded-[10px] p-2.5 ${isYellow ? "bg-white/30" : "bg-white/20"}`}>
            <p className={`text-[8px] font-black uppercase mb-0.5 ${isYellow ? "text-amber-900/60" : "text-blue-100/70"}`}>Peruntukan</p>
            <p className={`font-black leading-tight ${isYellow ? "text-amber-950" : "text-white"}`}>{purpose}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RekeningSection() {
  return (
    <section id="donasi" className="w-full bg-neutral-900 border-y-[3px] border-black py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Heading */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-amber-400 bg-amber-400/10 text-amber-300 px-3.5 py-1 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#f59e0b]">
            <Heart className="h-3 w-3 fill-amber-300" /> Cara Berdonasi
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
            Transfer Donasi Anda
          </h2>
          <p className="text-xs text-neutral-400 font-medium max-w-lg mx-auto leading-relaxed">
            Donasikan untuk pembangunan Menara Masjid Al-Ikhlas melalui rekening berikut. Setiap rupiah akan dicatat secara transparan.
          </p>
        </div>

        {/* Dua Card Rekening */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RekeningCard
            bankName="Bank Sumsel Babel"
            accountNumber="1531001879"
            accountName="Masjid Al-Ikhlas Meranjat II"
            purpose="Rekening Kas Masjid"
            colorScheme="yellow"
            badge="Rekening Masjid"
          />
          <RekeningCard
            bankName="Bank BRI"
            accountNumber="383201037490539"
            accountName="Ramlan Rozali"
            purpose="Dana Pembangunan Menara"
            colorScheme="blue"
            badge="Rekening Pembangunan"
          />
        </div>

        {/* Konfirmasi via WA */}
        <div className="border-[2.5px] border-black bg-neutral-800 rounded-[20px] p-6 shadow-[4px_4px_0px_0px_#10b981] space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-700 pb-3">
            <div className="h-9 w-9 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white">Sudah Transfer?</p>
              <p className="text-[10px] text-neutral-400 font-medium">Silakan konfirmasi via WhatsApp ke salah satu panitia berikut</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/6281377884175"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-[2px] border-black bg-neutral-700 hover:bg-emerald-900/60 rounded-[14px] p-3.5 transition-all shadow-[2px_2px_0px_0px_#10b981] hover:shadow-[3px_3px_0px_0px_#10b981]"
            >
              <div className="h-10 w-10 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">Ketua Pembangunan</p>
                <p className="text-xs font-black text-white leading-tight truncate">Bpk. Candra Gunawan</p>
                <p className="text-[10px] font-bold text-neutral-300 tracking-wider">0813-7788-4175</p>
              </div>
            </a>

            <a
              href="https://wa.me/6281278256470"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-[2px] border-black bg-neutral-700 hover:bg-emerald-900/60 rounded-[14px] p-3.5 transition-all shadow-[2px_2px_0px_0px_#10b981] hover:shadow-[3px_3px_0px_0px_#10b981]"
            >
              <div className="h-10 w-10 rounded-full border-[2px] border-emerald-400 bg-emerald-900/40 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">Ketua DKM</p>
                <p className="text-xs font-black text-white leading-tight truncate">Ustadz Ramlan</p>
                <p className="text-[10px] font-bold text-neutral-300 tracking-wider">0812-7825-6470</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
