import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, BarChart2, ShieldCheck, DollarSign, Calendar, Users, Building, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Pembangunan Menara Masjid Al-Ikhlas",
  description: "Sistem Pencatatan & Transparansi Keuangan Pembangunan Menara Masjid Al-Ikhlas",
};

export default function Home() {
  // Data panitia pembangunan
  const committee = [
    {
      name: "Zulfikar Ali, S.H",
      role: "Ketua Pembangunan",
      initials: "ZA"
    },
    {
      name: "Candra Gunawan, S.H",
      role: "Bendahara Pembangunan",
      initials: "CG"
    },
    {
      name: "Najemi",
      role: "Sekretaris Pembangunan",
      initials: "NJ"
    }
  ];

  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col font-sans">
      
      {/* 1. PUBLIC HEADER / HERO AREA */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-4 md:px-8 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-emerald-100 border-[1.5px] border-black rounded-[8px] flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
            <span className="text-xl">🕌</span>
          </div>
          <span className="text-sm font-black tracking-tight uppercase">Menara Al-Ikhlas</span>
        </div>
        <nav className="flex items-center gap-4 text-xs font-black uppercase">
          <Link href="/laporan-keuangan" className="text-emerald-800 hover:text-emerald-950 hover:underline">
            Laporan
          </Link>
          <Link href="/donasi" className="border-[2px] border-black bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#000] transition-all">
            Donasi Sekarang
          </Link>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Copy (col-span-7) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-black bg-amber-100 text-amber-900 px-3.5 py-1 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
              ✨ Wakaf Jariyah Pembangunan Menara
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-800 leading-[1.1]">
              Ukir Pahala Abadi Melalui Pembangunan Menara
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 font-bold leading-relaxed max-w-xl">
              &ldquo;Siapa yang membangun masjid karena Allah walaupun hanya selubang tempat bertelur burung... maka Allah akan bangunkan baginya rumah di surga.&rdquo; (HR. Ibnu Majah)
              <br />
              Mari investasikan tabungan akhirat Anda dalam menyukseskan pembangunan fisik Menara Masjid Al-Ikhlas sebagai lambang kejayaan dakwah Islam.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/donasi" 
                className="inline-flex items-center justify-center gap-2 border-[2.5px] border-black bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase px-6 py-4.5 rounded-[14px] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
              >
                <Heart className="h-4.5 w-4.5 fill-emerald-100 shrink-0" />
                Donasi Sekarang
              </Link>
              
              <Link 
                href="/laporan-keuangan"
                className="inline-flex items-center justify-center gap-2 border-[2.5px] border-black bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-black uppercase px-6 py-4.5 rounded-[14px] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
              >
                <BarChart2 className="h-4.5 w-4.5 text-emerald-700 shrink-0" />
                Lihat Laporan Keuangan
              </Link>
            </div>
          </div>

          {/* Hero Photos Grid (col-span-5) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Image 1: Mosque */}
            <div className="border-[2.5px] border-black bg-white rounded-[18px] p-2 shadow-[4px_4px_0px_0px_#ca8a04] overflow-hidden transform hover:-rotate-1 transition-transform">
              <div className="aspect-[3/4] relative w-full overflow-hidden rounded-[12px] bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/masjid.jpg" 
                  alt="Masjid Al-Ikhlas" 
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="block text-center text-[9px] font-black uppercase text-amber-950 mt-1.5">
                Masjid Al-Ikhlas
              </span>
            </div>

            {/* Image 2: Minaret */}
            <div className="border-[2.5px] border-black bg-white rounded-[18px] p-2 shadow-[4px_4px_0px_0px_#047857] overflow-hidden transform translate-y-4 hover:rotate-1 transition-transform">
              <div className="aspect-[3/4] relative w-full overflow-hidden rounded-[12px] bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/menara.jpg" 
                  alt="Rencana Menara" 
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="block text-center text-[9px] font-black uppercase text-emerald-950 mt-1.5">
                Desain Menara
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY METRICS & TRANSPARENCY PROMISE */}
      <section className="p-4 md:p-8 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
        <div className="border-[2px] border-black bg-white rounded-[16px] p-5 shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
          <div className="h-10 w-10 bg-emerald-100 border-[1.5px] border-black rounded-[8px] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-neutral-800">Transparansi 100%</h3>
            <p className="text-[10px] text-neutral-500 font-bold leading-normal">
              Setiap donasi luring maupun daring divalidasi langsung oleh bendahara pembangunan dan dipublikasi di log riil transaksi.
            </p>
          </div>
        </div>

        <div className="border-[2px] border-black bg-white rounded-[16px] p-5 shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
          <div className="h-10 w-10 bg-amber-100 border-[1.5px] border-black rounded-[8px] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
            <DollarSign className="h-5 w-5 text-amber-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-neutral-800">Target Efisiensi</h3>
            <p className="text-[10px] text-neutral-500 font-bold leading-normal">
              Target dana Rp 400 Juta dikelola secara cermat untuk pemenuhan material berkualitas tinggi dan upah tenaga kerja yang terencana.
            </p>
          </div>
        </div>

        <div className="border-[2px] border-black bg-white rounded-[16px] p-5 shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
          <div className="h-10 w-10 bg-blue-100 border-[1.5px] border-black rounded-[8px] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
            <Calendar className="h-5 w-5 text-blue-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-neutral-800">Pembaruan Real-Time</h3>
            <p className="text-[10px] text-neutral-500 font-bold leading-normal">
              Grafik sisa kas bulanan dan donasi terverifikasi diperbarui secara langsung bersumber dari database PostgreSQL.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SUSUNAN PANITIA / PROFIL SECTION */}
      <section className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6 pt-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 shadow-[1px_1px_0px_0px_#000]">
            Amanah & Profesional
          </span>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-neutral-800">
            Pelaksana & Penanggung Jawab
          </h2>
          <p className="text-[10px] md:text-xs text-neutral-500 font-medium max-w-md mx-auto">
            Panitia yang bertugas mengelola fisik konstruksi, administrasi, serta pelaporan keuangan pembangunan Menara Masjid Al-Ikhlas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {committee.map((person, idx) => (
            <div 
              key={idx}
              className="border-[2.5px] border-black bg-white rounded-[20px] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-center text-center space-y-3"
            >
              {/* Dummy Photo Avatar representation with beautiful color circle */}
              <div className="h-16 w-16 rounded-full border-[2px] border-black bg-amber-100 flex items-center justify-center text-amber-800 text-lg font-black shadow-[2px_2px_0px_0px_#000]">
                {person.initials}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase text-neutral-800 tracking-tight">{person.name}</h4>
                <p className="text-[9px] font-black uppercase text-emerald-800">{person.role}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] text-neutral-400 font-bold bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                ✔️ Panitia Resmi
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto border-t-[2.5px] border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Footer Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕌</span>
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
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>+62 821-xxxx-xxxx</span>
              </p>
            </div>
          </div>

          {/* Footer Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider">Tautan Cepat</h4>
            <div className="flex flex-col gap-2 text-[11px] font-black uppercase">
              <Link href="/donasi" className="text-emerald-800 hover:text-emerald-950 hover:underline">
                Formulir Donasi
              </Link>
              <Link href="/laporan-keuangan" className="text-emerald-800 hover:text-emerald-950 hover:underline">
                Statistik Keuangan
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright bar */}
        <div className="border-t-[2px] border-black bg-neutral-50 py-4 text-center text-[10px] font-bold text-neutral-500 px-4">
          © {new Date().getFullYear()} Panitia Pembangunan Masjid Al-Ikhlas. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>

    </main>
  );
}
