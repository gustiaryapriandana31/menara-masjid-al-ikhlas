import { BottomNavbar } from "@/components/shared/bottom-navbar"
import { Sidebar } from "@/components/shared/sidebar"
import AdminInstallButton from "@/components/shared/admin-install-button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar Brutalist - Mobile only */}
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-6 md:hidden">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full border border-black object-cover" />
            <span className="text-sm font-black tracking-tight uppercase">Panel Panitia Masjid</span>
          </div>
          <div className="flex items-center gap-2 border-[1.5px] border-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Online
          </div>
        </header>

        {/* Content wrapper */}
        <main className="p-4 md:p-8 w-full max-w-5xl md:max-w-6xl mx-auto flex-1 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile PWA Install Floating Button */}
      <div className="md:hidden fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto">
        <AdminInstallButton className="bg-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-[2.5px] border-black text-center" />
      </div>

      {/* Bottom Navbar - Mobile only */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  )
}
