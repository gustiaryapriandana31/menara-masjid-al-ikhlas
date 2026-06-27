"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { uploadReceipt } from '@/lib/storage'
import { DonationStatus } from '@prisma/client'

// Define validation schema using Zod
const createDonationConfirmationSchema = z.object({
  donorName: z.string()
    .min(3, "Nama donatur minimal 3 karakter")
    .max(255, "Nama donatur terlalu panjang"),
  donorAddress: z.string().max(255, "Alamat donatur terlalu panjang").optional(),
  isAnonymous: z.boolean().default(false),
  amount: z.number().positive("Nominal donasi harus lebih dari Rp 0"),
  transferDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal transfer tidak valid"
  }),
  paymentChannel: z.string().min(1, "Saluran pembayaran harus diisi")
})

/**
 * Server Action to validate and save donation confirmation.
 */
export async function createDonationConfirmation(prevState: unknown, formData: FormData) {
  try {
    // 1. Extract values from FormData
    const rawDonorName = formData.get('donorName')
    const rawDonorAddress = formData.get('donorAddress')
    const rawIsAnonymous = formData.get('isAnonymous') === 'true'
    const rawAmount = formData.get('amount')
    const rawTransferDate = formData.get('transferDate')
    const rawPaymentChannel = formData.get('paymentChannel')
    const files = formData.getAll('files') as File[]

    // 2. Validate input fields using Zod
    const validatedFields = createDonationConfirmationSchema.safeParse({
      donorName: rawDonorName?.toString(),
      donorAddress: rawDonorAddress?.toString() || undefined,
      isAnonymous: rawIsAnonymous,
      amount: rawAmount ? parseInt(rawAmount.toString(), 10) : 0,
      transferDate: rawTransferDate?.toString(),
      paymentChannel: rawPaymentChannel?.toString()
    })

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors
      const firstErrorMessage = Object.values(errors).flat()[0] || "Validasi input gagal."
      return {
        success: false,
        error: firstErrorMessage
      }
    }

    const data = validatedFields.data

    // 3. File upload validation (minimal 1 file is required)
    if (files.length === 0 || (files.length === 1 && files[0].size === 0)) {
      return {
        success: false,
        error: "Silakan unggah minimal satu bukti transfer gambar."
      }
    }

    const proofUrls: string[] = []
    for (const file of files) {
      if (!file || file.size === 0) continue

      // Server-side validation: Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        return {
          success: false,
          error: `File "${file.name}" melebihi ukuran maksimal 10MB.`
        }
      }

      // Server-side validation: Image files only
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: `File "${file.name}" harus berupa file gambar.`
        }
      }

      // Upload to Supabase Storage and collect the internal path
      const uploadedPath = await uploadReceipt(file)
      proofUrls.push(uploadedPath)
    }

    if (proofUrls.length === 0) {
      return {
        success: false,
        error: "Gagal memproses bukti transfer."
      }
    }

    // 4. Save to the database
    const confirmation = await db.donationConfirmation.create({
      data: {
        donorName: data.donorName,
        donorAddress: data.donorAddress || null,
        isAnonymous: data.isAnonymous,
        amount: data.amount,
        transferDate: new Date(data.transferDate),
        paymentChannel: data.paymentChannel,
        proofUrls: proofUrls,
        status: DonationStatus.PENDING,
      }
    })

    return {
      success: true,
      data: {
        id: confirmation.id
      }
    }

  } catch (err) {
    console.error("Error creating donation confirmation:", err)
    return {
      success: false,
      error: "Gagal menyimpan konfirmasi donasi. Silakan coba beberapa saat lagi."
    }
  }
}
