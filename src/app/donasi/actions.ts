"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { DonationStatus } from '@prisma/client'

// Validation schema
const createDonationConfirmationSchema = z.object({
  donorName: z.string()
    .min(3, "Nama donatur minimal 3 karakter")
    .max(255, "Nama donatur terlalu panjang"),
  donorAddress: z.string().max(255, "Alamat terlalu panjang").optional().nullable(),
  donorPhone: z.string().max(20, "Nomor telepon tidak valid").optional().nullable(),
  isAnonymous: z.boolean().default(false),
  amount: z.number().positive("Nominal donasi harus lebih dari Rp 0"),
  transferDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal transfer tidak valid"
  }),
  paymentChannel: z.string().min(1, "Saluran pembayaran harus diisi"),
  proofUrls: z.array(z.string()).min(1, "Silakan unggah minimal satu bukti transfer.")
})

interface DonationInput {
  donorName: string
  donorAddress?: string | null
  donorPhone?: string | null
  isAnonymous: boolean
  amount: number
  transferDate: string
  paymentChannel: string
  proofUrls: string[]
}

/**
 * Server Action: validate and save donation confirmation.
 * Receives files already uploaded directly to Supabase storage from the client.
 */
export async function createDonationConfirmation(input: DonationInput) {
  try {
    // Validate input fields using Zod
    const validatedFields = createDonationConfirmationSchema.safeParse(input)

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors
      const firstErrorMessage = Object.values(errors).flat()[0] || "Validasi input gagal."
      return { success: false, error: firstErrorMessage }
    }

    const data = validatedFields.data

    // Save to database
    const confirmation = await db.donationConfirmation.create({
      data: {
        donorName: data.donorName,
        donorAddress: data.donorAddress || null,
        donorPhone: data.donorPhone || null,
        isAnonymous: data.isAnonymous,
        amount: data.amount,
        transferDate: new Date(data.transferDate),
        paymentChannel: data.paymentChannel,
        proofUrls: data.proofUrls,
        status: DonationStatus.PENDING,
      }
    })

    return {
      success: true,
      data: { id: confirmation.id }
    }

  } catch (err) {
    console.error("Error creating donation confirmation:", err)
    return {
      success: false,
      error: "Gagal menyimpan konfirmasi donasi. Silakan coba beberapa saat lagi."
    }
  }
}
