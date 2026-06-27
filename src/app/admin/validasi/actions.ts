"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { DonationStatus, IncomeType } from "@prisma/client"

/**
 * LOGIC BELAJAR: MENYETUJUI DONASI ONLINE
 * Ketika disetujui, status diubah menjadi APPROVED, dan sistem secara otomatis
 * membuat entri baru di tabel Income (Pemasukan Utama) agar masuk perhitungan saldo kas.
 */
export async function approveDonationAction(id: string) {
  try {
    await db.$transaction(async (tx) => {
      // 1. Ambil data konfirmasi pending
      const confirmation = await tx.donationConfirmation.findUnique({
        where: { id }
      })

      if (!confirmation) {
        throw new Error("Data konfirmasi donasi tidak ditemukan.")
      }

      if (confirmation.status !== DonationStatus.PENDING) {
        throw new Error("Donasi ini sudah divalidasi sebelumnya.")
      }

      // 2. Update status konfirmasi menjadi APPROVED
      await tx.donationConfirmation.update({
        where: { id },
        data: {
          status: DonationStatus.APPROVED,
          validatedAt: new Date()
        }
      })

      // 3. Masukkan data ke kas pemasukan utama (Income)
      await tx.income.create({
        data: {
          donorName: confirmation.donorName,
          donorAddress: confirmation.donorAddress,
          amount: confirmation.amount,
          date: confirmation.transferDate,
          description: `Donasi Online via ${confirmation.paymentChannel}`,
          type: IncomeType.TRANSFER,
          receiptUrls: confirmation.proofUrls,
          donationConfirmationId: confirmation.id
        }
      })
    })

    // Revalidate data halaman admin & dashboard publik agar ter-update instan
    revalidatePath("/admin/validasi")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/admin/rincian-dana")
    revalidatePath("/")
    
    return { success: true }
  } catch (error: any) {
    console.error("Gagal menyetujui donasi:", error)
    return { success: false, error: error.message || "Terjadi kesalahan server." }
  }
}

/**
 * LOGIC BELAJAR: MENOLAK DONASI ONLINE
 * Jika ditolak, status diubah menjadi REJECTED dan panitia wajib memberikan
 * alasan penolakannya (misal: bukti palsu, nominal tidak masuk mutasi).
 */
export async function rejectDonationAction(id: string, reason: string) {
  if (!reason.trim()) {
    return { success: false, error: "Alasan penolakan wajib diisi." }
  }

  try {
    const confirmation = await db.donationConfirmation.findUnique({
      where: { id }
    })

    if (!confirmation) {
      throw new Error("Data konfirmasi donasi tidak ditemukan.")
    }

    if (confirmation.status !== DonationStatus.PENDING) {
      throw new Error("Donasi ini sudah divalidasi sebelumnya.")
    }

    // Update status konfirmasi menjadi REJECTED beserta alasan penolakan
    await db.donationConfirmation.update({
      where: { id },
      data: {
        status: DonationStatus.REJECTED,
        rejectionReason: reason,
        validatedAt: new Date()
      }
    })

    revalidatePath("/admin/validasi")
    
    return { success: true }
  } catch (error: any) {
    console.error("Gagal menolak donasi:", error)
    return { success: false, error: error.message || "Terjadi kesalahan server." }
  }
}
