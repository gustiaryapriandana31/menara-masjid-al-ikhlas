"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker on load
      const handleRegister = () => {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => {
            console.log("ServiceWorker registered successfully with scope:", reg.scope)
          })
          .catch((err) => {
            console.error("ServiceWorker registration failed:", err)
          })
      }

      if (document.readyState === "complete") {
        handleRegister()
      } else {
        window.addEventListener("load", handleRegister)
        return () => window.removeEventListener("load", handleRegister)
      }
    }
  }, [])

  return null
}
