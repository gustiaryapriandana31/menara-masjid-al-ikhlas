"use client"

import * as React from "react"
import { formatRupiah } from "@/lib/format"

type AnimationType = "income" | "outcome"

interface MoneyAnimationContextProps {
  triggerAnimation: (type: AnimationType, amount: number, description?: string) => void
}

const MoneyAnimationContext = React.createContext<MoneyAnimationContextProps | undefined>(undefined)

export function useMoneyAnimation() {
  const context = React.useContext(MoneyAnimationContext)
  if (!context) {
    throw new Error("useMoneyAnimation must be used within a MoneyAnimationProvider")
  }
  return context
}

export function MoneyAnimationProvider({ children }: { children: React.ReactNode }) {
  const [animation, setAnimation] = React.useState<{
    type: AnimationType
    amount: number
    description: string
  } | null>(null)

  const triggerAnimation = (type: AnimationType, amount: number, description = "") => {
    setAnimation({ type, amount, description })
    
    // Play Web Audio Synthesizer Sounds (Resource-efficient and works 100% offline!)
    if (type === "income") {
      playCoinSound()
    } else {
      playWhooshSound()
    }

    // Auto close after 3 seconds
    setTimeout(() => {
      setAnimation(null)
    }, 3000)
  }

  // Synthesize Coin Ding-Ding Sound
  const playCoinSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()

      // First note
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = "sine"
      osc1.frequency.setValueAtTime(987.77, ctx.currentTime) // B5 note
      gain1.gain.setValueAtTime(0.12, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start()
      osc1.stop(ctx.currentTime + 0.3)

      // Second note (slightly delayed, higher pitch)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08) // E6 note
      gain2.gain.setValueAtTime(0, ctx.currentTime)
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(ctx.currentTime + 0.08)
      osc2.stop(ctx.currentTime + 0.45)
    } catch (e) {
      console.error("Gagal memutar audio koin:", e)
    }
  }

  // Synthesize Paper Whoosh / Cash Out Sound
  const playWhooshSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      // Triangle wave simulates soft sliding paper sound
      osc.type = "triangle"
      osc.frequency.setValueAtTime(380, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35)

      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch (e) {
      console.error("Gagal memutar audio pengeluaran:", e)
    }
  }

  return (
    <MoneyAnimationContext.Provider value={{ triggerAnimation }}>
      {children}
      
      {/* Overlay Animasi */}
      {animation && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-[3px] border-black rounded-[24px] p-6 max-w-[280px] w-full text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Background elements decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-2 left-2 text-xs">🪙</div>
              <div className="absolute top-8 right-4 text-xs">💸</div>
              <div className="absolute bottom-4 left-6 text-xs">🪙</div>
            </div>

            {/* Animation Scene */}
            <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-3 border-[2px] border-black rounded-[14px] bg-[#faf8f5]">
              {/* Wallet/Kas Icon */}
              <div className="text-4xl z-10 animate-bounce">💼</div>

              {/* Floating Money Objects */}
              {animation.type === "income" ? (
                <>
                  <div className="absolute text-lg animate-coin-fall-1" style={{ top: "-20px", left: "25%" }}>🪙</div>
                  <div className="absolute text-lg animate-coin-fall-2" style={{ top: "-20px", left: "50%", animationDelay: "0.15s" }}>🪙</div>
                  <div className="absolute text-lg animate-coin-fall-3" style={{ top: "-20px", left: "70%", animationDelay: "0.3s" }}>🪙</div>
                </>
              ) : (
                <>
                  <div className="absolute text-lg animate-money-fly-1" style={{ bottom: "20px", left: "30%" }}>💸</div>
                  <div className="absolute text-lg animate-money-fly-2" style={{ bottom: "20px", left: "50%", animationDelay: "0.15s" }}>💸</div>
                  <div className="absolute text-lg animate-money-fly-3" style={{ bottom: "20px", left: "65%", animationDelay: "0.3s" }}>💸</div>
                </>
              )}
            </div>

            {/* Status Heading */}
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${
              animation.type === "income" ? "text-emerald-800" : "text-red-800"
            }`}>
              {animation.type === "income" ? "💵 Kas Masuk Dicatat" : "💸 Kas Keluar Dicatat"}
            </h3>

            {/* Amount */}
            <div className={`text-xl font-black tabular-nums mt-1.5 ${
              animation.type === "income" ? "text-emerald-700 animate-pulse" : "text-red-700"
            }`}>
              {animation.type === "income" ? "+" : "-"} Rp {formatRupiah(animation.amount)}
            </div>

            {/* Description (Optional) */}
            {animation.description && (
              <p className="text-[9px] text-neutral-500 font-bold uppercase truncate mt-1">
                {animation.description}
              </p>
            )}

            {/* CSS Keyframes injected dynamically to minimize asset footprint */}
            <style jsx global>{`
              @keyframes coin-fall {
                0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(70px) rotate(360deg); opacity: 0; }
              }
              @keyframes money-fly {
                0% { transform: translateY(20px) scale(0.6) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(-70px) scale(1.1) rotate(-45deg); opacity: 0; }
              }
              .animate-coin-fall-1 { animation: coin-fall 1.2s infinite ease-in; }
              .animate-coin-fall-2 { animation: coin-fall 1.2s infinite ease-in 0.15s; }
              .animate-coin-fall-3 { animation: coin-fall 1.2s infinite ease-in 0.3s; }
              .animate-money-fly-1 { animation: money-fly 1.2s infinite ease-out; }
              .animate-money-fly-2 { animation: money-fly 1.2s infinite ease-out 0.15s; }
              .animate-money-fly-3 { animation: money-fly 1.2s infinite ease-out 0.3s; }
            `}</style>
          </div>
        </div>
      )}
    </MoneyAnimationContext.Provider>
  )
}
