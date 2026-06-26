import { BottomNavbar } from "@/components/shared/bottom-navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 pb-24 font-sans">
      {/* Top Header Bar Brutalist */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕌</span>
          <span className="text-sm font-black tracking-tight uppercase">Panel Panitia Masjid</span>
        </div>
        <div className="flex items-center gap-2 border-[1.5px] border-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Online
        </div>
      </header>

      {/* Konten Halaman */}
      <main className="p-4 md:p-6 max-w-md mx-auto">
        {children}
      </main>

      {/* Navigasi Bawah */}
      <BottomNavbar />
    </div>
  )
}
