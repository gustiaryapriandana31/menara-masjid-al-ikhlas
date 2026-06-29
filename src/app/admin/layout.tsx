import { BottomNavbar } from "@/components/shared/bottom-navbar"
import { Sidebar } from "@/components/shared/sidebar"
import { logoutAction } from "@/app/login/actions"
import { LogOut } from "lucide-react"
import { NotificationProvider } from "@/components/shared/notification-provider"
import { NotificationBell } from "@/components/shared/notification-bell"
import { MoneyAnimationProvider } from "@/components/shared/money-animation-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <MoneyAnimationProvider>
        <div className="relative min-h-screen bg-[#faf8f5] text-neutral-900 font-sans flex flex-col md:flex-row md:h-screen md:overflow-hidden">
          {/* Sidebar for Desktop */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:h-screen md:overflow-y-auto">
            {/* Top Header Bar Brutalist - Mobile only */}
            <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b-[2.5px] border-black bg-white px-6 md:hidden">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full border border-black object-cover" />
                <span className="text-xs font-black tracking-tight uppercase">PANITIA PEMBANGUNAN</span>
              </div>
              <div className="flex items-center gap-2.5">
                <NotificationBell />
                
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex items-center justify-center h-8 w-8 rounded-[8px] border-[1.5px] border-black bg-red-50 hover:bg-red-100 text-red-700 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    title="Keluar Panel"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </form>
              </div>
            </header>

            {/* Content wrapper */}
            <main className="p-4 md:p-8 w-full max-w-5xl md:max-w-6xl mx-auto flex-1 pb-24 md:pb-8">
              {children}
            </main>
          </div>

          {/* Bottom Navbar - Mobile only */}
          <div className="md:hidden">
            <BottomNavbar />
          </div>
        </div>
      </MoneyAnimationProvider>
    </NotificationProvider>
  )
}
