import db from "@/lib/db"
import ValidasiClient from "./validasi-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Validasi Donasi Online - Panel Panitia",
  description: "Validasi bukti donasi transfer & QRIS yang dikirimkan oleh donatur."
}

export default async function ValidasiPage() {
  // Ambil semua konfirmasi donasi yang masih pending
  const pendingConfirmations = await db.donationConfirmation.findMany({
    where: {
      status: "PENDING"
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Serialisasi data agar aman dikirimkan ke Client Component
  const confirmations = pendingConfirmations.map(item => ({
    id: item.id,
    donorName: item.donorName,
    donorAddress: item.donorAddress || "",
    isAnonymous: item.isAnonymous,
    amount: Number(item.amount),
    transferDate: item.transferDate.toISOString().split("T")[0],
    paymentChannel: item.paymentChannel,
    proofUrls: item.proofUrls,
    status: item.status,
    createdAt: item.createdAt.toISOString()
  }))

  return (
    <ValidasiClient initialConfirmations={confirmations} />
  )
}
