import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { HandCoins, Heart, ShieldAlert, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sistem Keuangan Menara Masjid Al-Ikhlas",
  description: "Sistem Pencatatan & Pengelolaan Keuangan Pembangunan Menara Masjid Al-Ikhlas",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo and Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] border-[3px] border-black bg-emerald-100 shadow-[4px_4px_0px_0px_#047857]">
            <span className="text-4xl">🕌</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tight text-neutral-800 leading-tight">
              Menara Al-Ikhlas
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Sistem Pencatatan Keuangan
            </p>
          </div>
          <p className="text-xs text-neutral-600 font-medium px-4">
            Transparansi diutamakan, mewujudkan Menara Masjid Al-Ikhlas sebagai syiar bersama.
          </p>
        </div>

        {/* Main Brutalist Container */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
          
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-black uppercase tracking-tight text-neutral-700">Pilih Halaman Akses</h2>
            <p className="text-[10px] text-muted-foreground font-medium">Silakan masuk sesuai dengan kebutuhan Anda</p>
          </div>

          <hr className="border-t-[2px] border-black" />

          <div className="space-y-4">
            {/* Button 1: Konfirmasi Donasi Online (Public) */}
            <div className="group relative border-[2.5px] border-black bg-emerald-50 rounded-[16px] p-4 shadow-[3px_3px_0px_0px_#047857] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#047857] transition-all">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-[10px] border-[2px] border-black bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Heart className="h-5 w-5 fill-emerald-100 animate-pulse" />
                </div>
                <div className="space-y-1 pr-6">
                  <h3 className="text-xs font-black uppercase tracking-wide text-emerald-950">Konfirmasi Donasi</h3>
                  <p className="text-[10px] text-emerald-900/80 font-medium leading-relaxed">
                    Formulir donatur untuk melaporkan bukti transfer bank atau scan QRIS luring.
                  </p>
                </div>
              </div>
              <Link href="/donasi" className="absolute inset-0 flex items-center justify-end p-4">
                <div className="h-6 w-6 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000] group-hover:bg-emerald-100 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>

            {/* Button 2: Panel Panitia / Admin */}
            <div className="group relative border-[2.5px] border-black bg-blue-50 rounded-[16px] p-4 shadow-[3px_3px_0px_0px_#2563eb] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#2563eb] transition-all">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-[10px] border-[2px] border-black bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <HandCoins className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-6">
                  <h3 className="text-xs font-black uppercase tracking-wide text-blue-950">Panel Panitia</h3>
                  <p className="text-[10px] text-blue-900/80 font-medium leading-relaxed">
                    Khusus pengurus untuk mencatat pemasukan luring, pengeluaran belanja, dan verifikasi.
                  </p>
                </div>
              </div>
              <Link href="/admin/pemasukan" className="absolute inset-0 flex items-center justify-end p-4">
                <div className="h-6 w-6 rounded-full border-[1.5px] border-black bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000] group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-black bg-amber-100 text-amber-900 px-3 py-1 text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
            📌 Status Pembangunan: Tahap Konstruksi Menara (68%)
          </span>
        </div>

      </div>
    </main>
  );
}
