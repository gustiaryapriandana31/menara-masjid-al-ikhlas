import Link from 'next/link'
import { Metadata } from 'next'
import { Heart, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Konfirmasi Donasi – Menara Masjid Al-Ikhlas',
  description: 'Halaman konfirmasi donasi sementara tidak tersedia.',
  robots: { index: false, follow: false },
}

/**
 * Halaman /donasi sementara dinonaktifkan dari akses publik.
 * Logic backend, server actions, dan relasi database tetap dipertahankan
 * di donasi-client.tsx dan actions.ts untuk kebutuhan masa depan.
 */
export default function DonasiPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-black bg-amber-100 shadow-[4px_4px_0px_0px_#000] mx-auto">
          <Heart className="h-9 w-9 text-amber-700 fill-amber-200" />
        </div>

        {/* Card */}
        <div className="border-[2.5px] border-black bg-white rounded-[20px] p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h1 className="text-lg font-black uppercase tracking-tight text-neutral-800">
            Konfirmasi Donasi
          </h1>
          <div className="inline-block bg-amber-100 border-[1.5px] border-black text-amber-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">
            🚧 Sementara Tidak Tersedia
          </div>
          <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
            Fitur konfirmasi donasi online sementara tidak tersedia. Untuk berdonasi, silakan transfer langsung ke nomor rekening yang tertera di halaman utama.
          </p>
          <p className="text-[10px] text-neutral-500 font-medium">
            Setelah transfer, hubungi panitia via WhatsApp untuk konfirmasi manual.
          </p>
        </div>

        {/* Back */}
        <Link
          href="/#donasi"
          className="inline-flex items-center gap-2 border-[2px] border-black bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase px-5 py-3 rounded-[12px] shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Lihat Cara Donasi
        </Link>
      </div>
    </main>
  )
}
