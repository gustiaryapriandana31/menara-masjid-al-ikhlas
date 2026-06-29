"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { DonationStatus, IncomeType } from "@prisma/client"

/**
 * Server Action to delete an Income record.
 * If the Income was created via Donation Confirmation, resets the status to PENDING
 * so that it appears back on the validation page.
 */
export async function deleteIncomeAction(id: string) {
  try {
    await db.$transaction(async (tx) => {
      // Find the income record
      const income = await tx.income.findUnique({
        where: { id },
        select: { donationConfirmationId: true }
      })

      if (!income) {
        throw new Error("Pemasukan tidak ditemukan.")
      }

      // If this income has an associated online donation confirmation
      if (income.donationConfirmationId) {
        // Reset status to PENDING and clear validation time
        await tx.donationConfirmation.update({
          where: { id: income.donationConfirmationId },
          data: {
            status: DonationStatus.PENDING,
            validatedAt: null
          }
        })
      }

      // Delete the income record
      await tx.income.delete({
        where: { id }
      })
    })

    // Revalidate paths to refresh states across the app
    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/validasi")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting income transaction:", error)
    return { success: false, error: error.message || "Gagal menghapus data pemasukan." }
  }
}

/**
 * Server Action to delete an Outcome record.
 */
export async function deleteOutcomeAction(id: string) {
  try {
    const outcome = await db.outcome.findUnique({
      where: { id }
    })

    if (!outcome) {
      throw new Error("Pengeluaran tidak ditemukan.")
    }

    // Delete the outcome record
    await db.outcome.delete({
      where: { id }
    })

    // Revalidate paths to refresh states across the app
    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting outcome transaction:", error)
    return { success: false, error: error.message || "Gagal menghapus data pengeluaran." }
  }
}
