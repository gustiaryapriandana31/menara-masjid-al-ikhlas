"use server"

import db from "@/lib/db"
import { DonationStatus } from "@prisma/client"

/**
 * Gets the count of all donation confirmations with PENDING status.
 */
export async function getPendingDonationsCount() {
  try {
    const count = await db.donationConfirmation.count({
      where: {
        status: DonationStatus.PENDING,
      },
    })
    return { success: true, count }
  } catch (error: any) {
    console.error("Error fetching pending donations count:", error)
    return { success: false, count: 0, error: error.message || "Failed to fetch count" }
  }
}

/**
 * Gets the list of the 5 most recent pending donation confirmations.
 */
export async function getPendingDonationsList() {
  try {
    const list = await db.donationConfirmation.findMany({
      where: {
        status: DonationStatus.PENDING,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        donorName: true,
        amount: true,
        paymentChannel: true,
        createdAt: true,
      },
    })

    // Serialize Decimal amounts and Dates for client transmission
    const serialized = list.map((item) => ({
      id: item.id,
      donorName: item.donorName,
      amount: Number(item.amount),
      paymentChannel: item.paymentChannel,
      createdAt: item.createdAt.toISOString(),
    }))

    return { success: true, list: serialized }
  } catch (error: any) {
    console.error("Error fetching pending donations list:", error)
    return { success: false, list: [], error: error.message || "Failed to fetch list" }
  }
}
