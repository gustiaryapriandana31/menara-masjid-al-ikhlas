import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, BarChart2, ShieldCheck, DollarSign, Calendar, Users, Building, Mail, Phone, MapPin, Shield, Award, Megaphone, Eye, Camera, HardHat, CheckCircle2, UserCheck, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Pembangunan Menara Masjid Al-Ikhlas",
  description: "Sistem Pencatatan & Transparansi Keuangan Pembangunan Menara Masjid Al-Ikhlas",
};

export default function Home() {

  return (
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

        {/* TOP ROW: Pelindung, Penasehat, Penanggung Jawab */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Pelindung */}
          <div className="flex flex-col h-full">
            <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col flex-grow">
              <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
                🛡️ Pelindung
              </div>
              <div className="p-5 flex-grow flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full border-[2.5px] border-black bg-amber-100 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Shield className="h-6 w-6 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-800 tracking-tight">Dedi Iskandar</h4>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Kepala Desa Meranjat II</p>
                </div>
              </div>
            </div>
            {/* Connector down to bridge */}
            <div className="hidden lg:flex justify-center h-6">
              <div className="h-full w-[2.5px] bg-black" />
            </div>
          </div>

          {/* Penasehat */}
          <div className="flex flex-col h-full">
            <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col flex-grow">
              <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
                👥 Penasehat
              </div>
              <div className="p-5 flex-grow flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full border-[2.5px] border-black bg-amber-100 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Users className="h-6 w-6 text-emerald-800" />
                </div>
                <ul className="text-[9px] text-neutral-700 font-bold space-y-1 text-left list-disc list-inside">
                  <li>Imam Masjid Al-Ikhlas</li>
                  <li>Tokoh Agama</li>
                  <li>Tokoh Masyarakat</li>
                </ul>
              </div>
            </div>
            {/* Connector down to bridge */}
            <div className="hidden lg:flex justify-center h-6">
              <div className="h-full w-[2.5px] bg-black" />
            </div>
          </div>

          {/* Penanggung Jawab */}
          <div className="flex flex-col h-full">
            <div className="border-[2.5px] border-black bg-white rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col flex-grow">
              <div className="bg-emerald-800 text-white py-2 px-4 border-b-[2.5px] border-black text-center text-xs font-black uppercase tracking-wider">
                📜 Penanggung Jawab
              </div>
              <div className="p-5 flex-grow flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full border-[2.5px] border-black bg-amber-100 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <UserCheck className="h-6 w-6 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-800 tracking-tight">Ust. Ramlan Rozali, S.Sos</h4>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Ketua DKM Masjid Al-Ikhlas</p>
                </div>
              </div>
            </div>
            {/* Connector down to bridge */}
            <div className="hidden lg:flex justify-center h-6">
              <div className="h-full w-[2.5px] bg-black" />
            </div>
          </div>
        </div>

        {/* Connector Bridge 1 (Desktop only) */}
        <div className="hidden lg:flex flex-col items-center -mt-6 mb-6 relative z-10">
          <div className="w-[66%] h-[2.5px] bg-black" />
          <div className="h-8 w-[2.5px] bg-black relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-[50%] translate-y-[2px] w-2.5 h-2.5 bg-black rotate-45" />
          </div>
        </div>

        {/* Mobile Connecting Line */}
        <div className="lg:hidden flex flex-col items-center -my-3 relative z-10">
          <div className="h-10 w-[2.5px] bg-black border-dashed relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-[50%] translate-y-[1px] w-2 h-2 bg-black rotate-45" />
          </div>
        </div>

        {/* MIDDLE ROW: Pengurus Harian */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <div className="text-center">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[1px_1px_0px_0px_#000]">
              Pengurus Harian
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ketua */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-2.5">
              <div className="h-10 w-10 rounded-full border-[1.5px] border-black bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                ZA
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800">Zulfikar Ali, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase">Ketua Pembangunan</p>
              </div>
            </div>

            {/* Wakil Ketua */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-2.5">
              <div className="h-10 w-10 rounded-full border-[1.5px] border-black bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                AT
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800">Agus Tomi, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase">Wakil Ketua Pembangunan</p>
              </div>
            </div>

            {/* Sekretaris */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-2.5">
              <div className="h-10 w-10 rounded-full border-[1.5px] border-black bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                NJ
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800">Najemi</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase">Sekretaris Pembangunan</p>
              </div>
            </div>

            {/* Bendahara */}
            <div className="border-[2px] border-black bg-[#fbfaf7] rounded-[16px] p-4 flex flex-col items-center text-center space-y-2.5">
              <div className="h-10 w-10 rounded-full border-[1.5px] border-black bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                CG
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase text-neutral-800">Candra Gunawan, S.H</h4>
                <p className="text-[8px] font-bold text-emerald-700 uppercase">Bendahara Pembangunan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Bridge 2 (Desktop only) */}
        <div className="hidden lg:flex flex-col items-center -my-2 relative z-10">
          <div className="h-10 w-[2.5px] bg-black relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-[50%] translate-y-[2px] w-2.5 h-2.5 bg-black rotate-45" />
          </div>
        </div>

        {/* Mobile Connecting Line */}
        <div className="lg:hidden flex flex-col items-center -my-1 relative z-10">
          <div className="h-10 w-[2.5px] bg-black border-dashed relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-[50%] translate-y-[1px] w-2 h-2 bg-black rotate-45" />
          </div>
        </div>

        {/* SEKSI-SEKSI */}
        <div className="border-[2.5px] border-black bg-white rounded-[22px] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <div className="text-center">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[1px_1px_0px_0px_#000]">
              Seksi-Seksi Kerja
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Seksi Penggalangan Dana */}
            <div className="border-[2px] border-black bg-[#fdfdfc] rounded-[18px] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <div className="h-7 w-7 rounded-full border border-black bg-emerald-50 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4 text-emerald-800" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-neutral-800 tracking-tight leading-tight">Penggalangan Dana</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-neutral-400 uppercase">Anggota</p>
                  <p className="text-[9px] font-black text-neutral-700">Panitia 1, Panitia 2, Panitia 3</p>
                </div>
              </div>
              <div className="bg-[#f7f5f0] border border-black rounded-[10px] p-2.5 text-[9px] font-semibold text-neutral-600 leading-relaxed">
                Bertugas menggalang dan menerima donasi, menyusun proposal, dan laporan dana.
              </div>
            </div>

            {/* Seksi Humas */}
            <div className="border-[2px] border-black bg-[#fdfdfc] rounded-[18px] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <div className="h-7 w-7 rounded-full border border-black bg-emerald-50 flex items-center justify-center shrink-0">
                    <Megaphone className="h-4 w-4 text-emerald-800" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-neutral-800 tracking-tight leading-tight">Hubungan Masyarakat</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-neutral-400 uppercase">Anggota</p>
                  <p className="text-[9px] font-black text-neutral-700">Panitia 1, Panitia 2, Panitia 3</p>
                </div>
              </div>
              <div className="bg-[#f7f5f0] border border-black rounded-[10px] p-2.5 text-[9px] font-semibold text-neutral-600 leading-relaxed">
                Bertugas menjalin komunikasi dengan jamaah, donatur, masyarakat, dan pihak terkait lainnya.
              </div>
            </div>

            {/* Seksi Pengawasan */}
            <div className="border-[2px] border-black bg-[#fdfdfc] rounded-[18px] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <div className="h-7 w-7 rounded-full border border-black bg-emerald-50 flex items-center justify-center shrink-0">
                    <Eye className="h-4 w-4 text-emerald-800" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-neutral-800 tracking-tight leading-tight">Pengawasan Lapangan</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-neutral-400 uppercase">Anggota</p>
                  <p className="text-[9px] font-black text-neutral-700">Panitia 1, Panitia 2, Panitia 3</p>
                </div>
              </div>
              <div className="bg-[#f7f5f0] border border-black rounded-[10px] p-2.5 text-[9px] font-semibold text-neutral-600 leading-relaxed">
                Bertugas mengawasi progres pekerjaan pemborong, kualitas pekerjaan, dan kesesuaian dengan kesepakatan.
              </div>
            </div>

            {/* Seksi Dokumentasi & Publikasi */}
            <div className="border-[2px] border-black bg-[#fdfdfc] rounded-[18px] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <div className="h-7 w-7 rounded-full border border-black bg-emerald-50 flex items-center justify-center shrink-0">
                    <Camera className="h-4 w-4 text-emerald-800" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-neutral-800 tracking-tight leading-tight">Dokumentasi & Publikasi</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-neutral-400 uppercase">Anggota</p>
                  <p className="text-[9px] font-black text-neutral-700">Panitia 1, Panitia 2, Panitia 3</p>
                </div>
              </div>
              <div className="bg-[#f7f5f0] border border-black rounded-[10px] p-2.5 text-[9px] font-semibold text-neutral-600 leading-relaxed">
                Bertugas mendokumentasikan kegiatan pembangunan serta menyampaikan informasi kepada masyarakat.
              </div>
            </div>
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
      <footer className="mt-auto border-t-[2.5px] border-black bg-white">
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

    </main>
  );
}
