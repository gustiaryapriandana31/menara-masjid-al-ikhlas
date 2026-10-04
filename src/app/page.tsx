import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, BarChart2, ShieldCheck, DollarSign, Calendar, Users, Building, Mail, Phone, MapPin, Shield, Award, Megaphone, Eye, Camera, HardHat, CheckCircle2, UserCheck, Briefcase } from "lucide-react";
import { HomePageJsonLd, OrganizationJsonLd } from "@/components/shared/json-ld";
import Footer from "@/components/shared/footer";
import panitiaData from "@/data/panitia.json";

export const metadata: Metadata = {
  title: "Menara Masjid Al-Ikhlas – Donasi Pembangunan & Transparansi Keuangan",
  description:
    "Donasikan untuk pembangunan Menara Masjid Al-Ikhlas. Wakaf jariyah terpercaya dengan laporan keuangan transparan, konfirmasi donasi online via transfer bank & QRIS. Bersama kita wujudkan Menara Al-Ikhlas.",
  keywords: [
    "donasi menara masjid al ikhlas",
    "wakaf menara masjid",
    "donasi masjid al ikhlas",
    "sedekah jariyah masjid",
    "donasi pembangunan masjid",
    "menara masjid al ikhlas",
    "masjid al ikhlas",
    "konfirmasi donasi masjid",
    "laporan keuangan masjid",
    "donasi QRIS masjid",
  ],
  alternates: {
    canonical: "https://menara-masjid-al-ikhlas.vercel.app",
  },
  openGraph: {
    title: "Donasi Pembangunan Menara Masjid Al-Ikhlas",
    description:
      "Wujudkan pahala jariyah Anda. Donasi pembangunan Menara Masjid Al-Ikhlas – transparan, amanah, real-time.",
    url: "https://menara-masjid-al-ikhlas.vercel.app",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function Home() {

  return (
    <>
      <HomePageJsonLd />
      <OrganizationJsonLd />
      <main className="min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col font-sans">
      
      {/* 2. HERO SECTION */}
      <section className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Copy (col-span-7) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-black bg-amber-100 text-amber-900 px-3.5 py-1 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
              ✨ Wakaf Jariyah Pembangunan Menara
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-800 leading-[1.1]">
              Ukir Pahala Abadi Melalui Pembangunan Menara
            </h1>
            
            {/* Hadits Box */}
            <div className="bg-emerald-50/50 border-[2px] border-black rounded-[18px] p-4.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2.5 max-w-xl">
              <p className="text-right text-base md:text-lg font-serif text-emerald-800 leading-normal tracking-wide font-black" dir="rtl">
                مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ
              </p>
              <p className="text-[11px] text-neutral-700 font-bold leading-relaxed">
                &ldquo;Siapa yang membangun masjid karena Allah, maka Allah akan membangun baginya semisal itu di surga.&rdquo;
              </p>
              <p className="text-[9px] text-emerald-800 font-black uppercase tracking-widest">
                — HR. Bukhari no. 450 dan Muslim no. 533
              </p>
            </div>

            <p className="text-xs md:text-sm text-neutral-600 font-bold leading-relaxed max-w-xl">
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
              Target dana Rp 459.510.000 dikelola secara cermat untuk pemenuhan material berkualitas tinggi dan upah tenaga kerja yang terencana.
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
              Grafik sisa kas bulanan dan donasi terverifikasi diperbarui secara langsung bersumber dari database.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SUSUNAN PANITIA / BAGAN STRUKTUR */}
      <section className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 pt-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-55 px-3 py-1 rounded-full border border-emerald-300 shadow-[1px_1px_0px_0px_#000]">
            Bagan Organisasi
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-800">
            Susunan Panitia Pembangunan Menara
          </h2>
          <p className="text-[10px] md:text-xs text-neutral-500 font-medium max-w-md mx-auto">
            Struktur kepengurusan dan pelaksana pembangunan Menara Masjid Al-Ikhlas Desa Meranjat II.
          </p>
        </div>

        {/* ROW 1: Pelindung & Penasehat (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
          {/* Pelindung */}
          <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col justify-between">
            <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
              🛡️ Pelindung
            </div>
            <div className="p-4 flex-grow flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-10 w-10 rounded-full border-[2px] border-black bg-amber-100 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                <Shield className="h-5 w-5 text-emerald-800" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-800 tracking-tight">Dedi Iskandar</h4>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Kepala Desa Meranjat II</p>
              </div>
            </div>
          </div>

          {/* Penasehat */}
          <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col justify-between">
            <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
              👥 Penasehat
            </div>
            <div className="p-4 flex-grow flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-10 w-10 rounded-full border-[2px] border-black bg-amber-100 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                <Users className="h-5 w-5 text-emerald-800" />
              </div>
              <ul className="text-[9px] text-neutral-700 font-bold space-y-0.5 text-left list-disc list-inside">
                <li>Imam Masjid Al-Ikhlas</li>
                <li>Tokoh Agama</li>
                <li>Tokoh Masyarakat</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Connector Tree 1: Pelindung & Penasehat -> Penanggung Jawab */}
        <div className="relative max-w-3xl mx-auto h-8 -mt-[2px] -mb-[2px] flex justify-center items-center z-0">
          {/* Desktop T-bar connector */}
          <div className="hidden md:block absolute inset-0">
            {/* Left drop line directly from bottom of Pelindung card (25%) */}
            <div className="absolute top-0 left-[25%] h-4 w-[2.5px] bg-black" />
            {/* Right drop line directly from bottom of Penasehat card (75%) */}
            <div className="absolute top-0 right-[25%] h-4 w-[2.5px] bg-black" />
            {/* Horizontal line connecting left and right drops */}
            <div className="absolute top-4 left-[25%] right-[25%] h-[2.5px] bg-black" />
            {/* Center stem down from horizontal line to Penanggung Jawab */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bottom-0 w-[2.5px] bg-black" />
          </div>

          {/* Mobile vertical line */}
          <div className="md:hidden flex flex-col items-center h-full">
            <div className="h-full w-[2.5px] bg-black" />
          </div>
        </div>

        {/* ROW 2: Penanggung Jawab (Sendirian di tengah) */}
        <div className="max-w-md mx-auto relative z-10">
          <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
              📜 Penanggung Jawab
            </div>
            <div className="p-4 flex items-center justify-center gap-4 text-left">
              <div className="h-16 w-16 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden bg-emerald-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panitia/Ust Ramlan.jpeg"
                  alt="Ustadz Ramlan Rozali"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-800 tracking-tight">Ust. Ramlan Rozali, S.Sos</h4>
                <p className="text-[9px] text-emerald-800 font-extrabold uppercase mt-0.5">Ketua DKM Masjid Al-Ikhlas</p>
                <p className="text-[8px] text-neutral-500 font-semibold mt-0.5">Mengawasi & Membina Seluruh Kepanitiaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Tree 2: Penanggung Jawab -> Pengurus Harian */}
        <div className="flex flex-col items-center h-7 -mt-[2px] -mb-[2px] relative z-0">
          <div className="h-full w-[2.5px] bg-black" />
        </div>

        {/* MIDDLE ROW: Pengurus Harian */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5 relative z-10">
          <div className="text-center">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[1px_1px_0px_0px_#000]">
              Pengurus Harian
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ketua */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-20 w-20 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden bg-emerald-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panitia/Mang Fifik.jpeg"
                  alt="Zulfikar Ali"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800 leading-tight">Zulfikar Ali, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase mt-0.5">Ketua Pembangunan</p>
              </div>
            </div>

            {/* Wakil Ketua */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-20 w-20 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden bg-emerald-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panitia/Mang Agus.jpeg"
                  alt="Agus Tomi"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800 leading-tight">Agus Tomi, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase mt-0.5">Wakil Ketua Pembangunan</p>
              </div>
            </div>

            {/* Sekretaris */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-20 w-20 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden bg-emerald-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panitia/Mang Jemi.jpeg"
                  alt="Najemi"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800 leading-tight">Najemi</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase mt-0.5">Sekretaris Pembangunan</p>
              </div>
            </div>

            {/* Bendahara */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-20 w-20 rounded-full border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden bg-emerald-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panitia/Mang Candra.jpeg"
                  alt="Candra Gunawan"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800 leading-tight">Candra Gunawan, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase mt-0.5">Bendahara Pembangunan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Tree 3: Pengurus Harian -> Seksi-Seksi Kerja */}
        <div className="flex flex-col items-center h-7 -mt-[2px] -mb-[2px] relative z-0">
          <div className="h-full w-[2.5px] bg-black" />
        </div>

        {/* SEKSI-SEKSI KERJA */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4 relative z-10">
          <div className="text-center">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[1px_1px_0px_0px_#000]">
              Seksi-Seksi Kerja
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {panitiaData.seksiSeksi.map((seksi) => {
              const IconComponent =
                seksi.icon === "DollarSign"
                  ? DollarSign
                  : seksi.icon === "Megaphone"
                  ? Megaphone
                  : seksi.icon === "Eye"
                  ? Eye
                  : Camera;

              return (
                <div
                  key={seksi.id}
                  className="border-[2px] border-black bg-[#fdfdfc] rounded-[16px] p-3.5 flex flex-col justify-between space-y-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="space-y-2.5">
                    {/* Header Seksi */}
                    <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
                      <div className="h-7 w-7 rounded-full border border-black bg-emerald-100 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]">
                        <IconComponent className="h-3.5 w-3.5 text-emerald-900" />
                      </div>
                      <h4 className="text-[11px] font-black uppercase text-neutral-800 tracking-tight leading-tight">
                        {seksi.namaSeksi}
                      </h4>
                    </div>

                    {/* Koordinator / Ketua Seksi */}
                    <div className="space-y-1.5 bg-amber-50/90 border border-amber-300 rounded-[10px] p-2">
                      <span className="text-[7.5px] font-black text-amber-900 uppercase tracking-wider bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-400/80 inline-block">
                        👑 Koordinator
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {seksi.koordinator.map((koor, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-white border border-black rounded-full py-0.5 px-2 shadow-[1px_1px_0px_0px_#000]"
                          >
                            <div className="h-6 w-6 rounded-full border border-black overflow-hidden bg-emerald-50 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={koor.foto || "/avatar-islam.png"}
                                alt={koor.nama}
                                className="h-full w-full object-cover object-top"
                              />
                            </div>
                            <span className="text-[9px] font-black text-neutral-800">
                              {koor.nama}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Anggota Seksi */}
                    <div className="space-y-1 pt-0.5">
                      <span className="text-[7.5px] font-black text-neutral-500 uppercase tracking-wider">
                        👥 Anggota ({seksi.anggota.length} Orang)
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {seksi.anggota.map((m, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg p-1 shadow-xs"
                          >
                            <div className="h-5 w-5 rounded-full border border-neutral-800 overflow-hidden bg-neutral-100 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={m.foto || "/avatar-islam.png"}
                                alt={m.nama}
                                className="h-full w-full object-cover object-top"
                              />
                            </div>
                            <span className="text-[8.5px] font-bold text-neutral-800 truncate leading-tight">
                              {m.nama}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Seksi */}
                  <div className="bg-[#f7f5f0] border border-neutral-300 rounded-[8px] p-2 text-[8.5px] font-medium text-neutral-600 leading-snug">
                    {seksi.deskripsi}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ROW: Luar Struktur & Keterangan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Di Luar Struktur Panitia */}
          <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <h3 className="text-xs font-black uppercase text-neutral-800 border-b-[2px] border-black pb-2 flex items-center gap-2">
              <HardHat className="h-4 w-4 text-amber-600" />
              Di Luar Struktur Panitia
            </h3>
            
            <div className="space-y-4">
              {/* Pemborong */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full border border-black bg-amber-50 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4 text-amber-800" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-neutral-800">Pemborong / Kontraktor</span>
                    <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Pemborong 1</span>
                  </div>
                  <p className="text-[9px] font-semibold text-neutral-600 leading-normal">
                    Melaksanakan pekerjaan pembangunan fisik menara secara terstruktur sesuai kontrak/kesepakatan.
                  </p>
                </div>
              </div>

              {/* Mandor */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full border border-black bg-amber-50 flex items-center justify-center shrink-0">
                  <HardHat className="h-4 w-4 text-amber-800" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-neutral-800">Mandor</span>
                    <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Mandor 1</span>
                  </div>
                  <p className="text-[9px] font-semibold text-neutral-600 leading-normal">
                    Mengkoordinir, memantau, dan mengawasi tukang serta pekerja langsung di lokasi lapangan secara teratur.
                  </p>
                </div>
              </div>

              {/* Tukang & Pekerja */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full border border-black bg-amber-50 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-amber-800" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-neutral-800">Tukang & Pekerja</span>
                    <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Pekerja 1</span>
                  </div>
                  <p className="text-[9px] font-semibold text-neutral-600 leading-normal">
                    Melaksanakan pekerjaan teknis lapangan sesuai arahan dari mandor dan pemborong konstruksi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <h3 className="text-xs font-black uppercase text-neutral-800 border-b-[2px] border-black pb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Keterangan & Aturan Kerja
            </h3>
            
            <div className="space-y-3.5 text-[9px] font-semibold text-neutral-700 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>Panitia bertanggung jawab langsung kepada DKM (Dewan Kemakmuran Masjid) Masjid Al-Ikhlas.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>Panitia memiliki kewenangan penuh mengelola dana, administrasi, penggalangan dana, dan pengawasan konstruksi.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>Pemborong bertanggung jawab penuh atas kualitas hasil dan keselamatan pelaksanaan pekerjaan fisik sesuai kontrak kerja.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>Seluruh pengelolaan dana wajib dilakukan secara transparan, akuntabel, dan dapat dipertanggungjawabkan kepada jamaah DKM serta publik.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />

    </main>
    </>
  );
}
