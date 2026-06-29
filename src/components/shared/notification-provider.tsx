"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { getPendingDonationsCount, getPendingDonationsList } from "@/app/admin/actions"

export interface PendingDonation {
  id: string
  donorName: string
  amount: number
  paymentChannel: string
  createdAt: string
}

interface NotificationContextType {
  pendingCount: number
  pendingList: PendingDonation[]
  permission: NotificationPermission
  requestPermission: () => Promise<void>
  refetch: () => Promise<void>
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = React.useState<number>(0)
  const [pendingList, setPendingList] = React.useState<PendingDonation[]>([])
  const [permission, setPermission] = React.useState<NotificationPermission>("default")

  // Refs to keep track of previous values inside callbacks without triggering re-runs
  const prevCountRef = React.useRef<number>(0)
  const prevLatestIdRef = React.useRef<string>("")

  // Fetch count and list
  const refetch = React.useCallback(async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        getPendingDonationsCount(),
        getPendingDonationsList(),
      ])

      if (countRes.success && listRes.success) {
        const newCount = countRes.count
        const newList = listRes.list as PendingDonation[]

        // Check if there is a new donation pending
        const hasIncreased = newCount > prevCountRef.current
        const latestItem = newList[0]
        const latestIdChanged = latestItem && latestItem.id !== prevLatestIdRef.current

        if ((hasIncreased || latestIdChanged) && latestItem) {
          // Trigger system push notification if permission is granted
          triggerSystemNotification(latestItem)
        }

        // Update refs and state
        prevCountRef.current = newCount
        if (latestItem) {
          prevLatestIdRef.current = latestItem.id
        }
        
        setPendingCount(newCount)
        setPendingList(newList)
      }
    } catch (err) {
      console.error("Error refetching notifications:", err)
    }
  }, [])

  // Trigger browser push notification
  const triggerSystemNotification = (donation: PendingDonation) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        const title = "Donasi Baru Menunggu Validasi 🕌"
        const formattedAmount = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
        }).format(donation.amount)
        const body = `Konfirmasi transfer dari ${donation.donorName} sebesar ${formattedAmount} via ${donation.paymentChannel}.`

        // Use service worker notification if registered for better OS background integration
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
              body,
              icon: "/logo.jpg",
              badge: "/logo.jpg",
              tag: "new-donation",
              renotify: true,
              requireInteraction: true,
            } as any)
          }).catch((err) => {
            console.error("Service worker notification failed, falling back:", err)
            new Notification(title, { body, icon: "/logo.jpg" })
          })
        } else {
          new Notification(title, { body, icon: "/logo.jpg" })
        }
      }
    }
  }

  // Request browser notification permission
  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const res = await Notification.requestPermission()
        setPermission(res)
        if (res === "granted") {
          // Show a test/welcome notification
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification("Notifikasi Aktif! 🔔", {
                body: "Anda akan menerima pemberitahuan setiap ada donasi online baru.",
                icon: "/logo.jpg",
              })
            })
          } else {
            new Notification("Notifikasi Aktif! 🔔", {
              body: "Anda akan menerima pemberitahuan setiap ada donasi online baru.",
              icon: "/logo.jpg",
            })
          }
        }
      } catch (err) {
        console.error("Error requesting notification permission:", err)
      }
    }
  }

  // Initialize permission status and fetch initial data
  React.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }

    // Initial fetch
    refetch()

    // 1. Supabase Real-Time Listener on 'DonationConfirmation'
    const channel = supabase
      .channel("realtime-donation-notifications")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "DonationConfirmation",
        },
        (payload) => {
          console.log("Realtime DB update received:", payload)
          refetch()
        }
      )
      .subscribe((status) => {
        console.log("Supabase Realtime subscription status:", status)
      })

    // 2. Fallback Polling every 30 seconds
    const intervalId = setInterval(() => {
      console.log("Running fallback notification check...")
      refetch()
    }, 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(intervalId)
    }
  }, [refetch])

  return (
    <NotificationContext.Provider
      value={{
        pendingCount,
        pendingList,
        permission,
        requestPermission,
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
