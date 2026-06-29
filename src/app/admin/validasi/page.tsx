import db from "@/lib/db"
import ValidasiClient from "./validasi-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Validasi Donasi Online - Panel Panitia",
  description: "Validasi bukti donasi transfer & QRIS yang dikirimkan oleh donatur."
}

export default async function ValidasiPage() {
  // Ambil semua konfirmasi donasi PENDING dan histori (APPROVED + REJECTED)
  const [pendingConfirmations, historyConfirmations] = await Promise.all([
    db.donationConfirmation.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" }
    }),
    db.donationConfirmation.findMany({
      where: { status: { in: ["APPROVED", "REJECTED"] } },
      orderBy: { validatedAt: "desc" },
      take: 50
    })
  ])

  const serializeItem = (item: typeof pendingConfirmations[0]) => ({
    id: item.id,
    donorName: item.donorName,
    donorAddress: item.donorAddress || "",
    donorPhone: item.donorPhone || "",
    isAnonymous: item.isAnonymous,
    amount: Number(item.amount),
    transferDate: item.transferDate.toISOString().split("T")[0],
    paymentChannel: item.paymentChannel,
    proofUrls: item.proofUrls,
    status: item.status,
    rejectionReason: item.rejectionReason || "",
    validatedAt: item.validatedAt ? item.validatedAt.toISOString().split("T")[0] : "",
    createdAt: item.createdAt.toISOString()
  })

  return (
    <ValidasiClient 
      initialConfirmations={pendingConfirmations.map(serializeItem)}
      historyConfirmations={historyConfirmations.map(serializeItem)}
    />
  )
}
