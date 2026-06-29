import * as React from "react"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto border-t-[2.5px] border-black bg-white w-full">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Footer Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full border-[1.5px] border-black object-cover" />
            <span className="text-base font-black tracking-tight uppercase text-neutral-800">Masjid Al-Ikhlas</span>
          </div>
          <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
            Inisiatif pencatatan keuangan transparan untuk mewujudkan Menara Masjid Al-Ikhlas sebagai syiar bersama. Setiap rupiah wakaf Anda dipertanggungjawabkan secara terbuka.
          </p>
        </div>

        {/* Footer Col 2 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Sekretariat Pembangunan</h4>
          <div className="space-y-2.5 text-[11px] font-semibold text-neutral-700">
            <p className="flex items-start gap-2 leading-relaxed">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-700" />
              <span>Masjid Al-Ikhlas, Dusun I Meranjat II, Kecamatan Indralaya Selatan, Kabupaten Ogan Ilir, Sumatera Selatan.</span>
            </p>
            <a 
              href="https://wa.me/6281377884175" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-emerald-850 hover:underline transition-all"
            >
              <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
              <span>WA: 0813-7788-4175</span>
            </a>
            <a 
              href="https://web.facebook.com/masjid.alikhlas.338" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-emerald-850 hover:underline transition-all"
            >
              <svg className="h-4 w-4 shrink-0 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span>Facebook : Masjid Al-Ikhlas</span>
            </a>
          </div>
        </div>

        {/* Footer Col 3 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Link Cepat</h4>
          <div className="flex flex-col gap-2 text-[11px] font-black uppercase">
            <Link href="/donasi" className="text-emerald-800 hover:text-emerald-950 hover:underline">
              Formulir Donasi
            </Link>
            <Link href="/laporan-keuangan" className="text-emerald-800 hover:text-emerald-950 hover:underline">
              Laporan Keuangan
            </Link>
          </div>
        </div>

      </div>

      {/* Copyright bar */}
      <div className="border-t-[2px] border-black bg-neutral-50 py-4 text-center text-[10px] font-bold text-neutral-500 px-4">
        © {new Date().getFullYear()} Panitia Pembangunan Masjid Al-Ikhlas. Seluruh Hak Cipta Dilindungi.
      </div>
    </footer>
  )
}
