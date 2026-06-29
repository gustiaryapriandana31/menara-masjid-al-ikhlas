"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { DonationStatus } from '@prisma/client'

// Validation schema
const createDonationConfirmationSchema = z.object({
  donorName: z.string()
    .min(3, "Nama donatur minimal 3 karakter")
    .max(255, "Nama donatur terlalu panjang"),
  donorAddress: z.string().max(255, "Alamat terlalu panjang").optional(),
  donorPhone: z.string().max(20, "Nomor telepon tidak valid").optional(),
  isAnonymous: z.boolean().default(false),
  amount: z.number().positive("Nominal donasi harus lebih dari Rp 0"),
  transferDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal transfer tidak valid"
  }),
  paymentChannel: z.string().min(1, "Saluran pembayaran harus diisi"),
})

/**
 * Server Action: validate and save donation confirmation.
 * Files are sent as base64 strings to avoid Vercel serverless File object issues.
 */
export async function createDonationConfirmation(_prevState: unknown, formData: FormData) {
  try {
    // 1. Extract text fields
    const rawDonorName = formData.get('donorName')
    const rawDonorAddress = formData.get('donorAddress')
    const rawDonorPhone = formData.get('donorPhone')
    const rawIsAnonymous = formData.get('isAnonymous') === 'true'
    const rawAmount = formData.get('amount')
    const rawTransferDate = formData.get('transferDate')
    const rawPaymentChannel = formData.get('paymentChannel')

    // 2. Validate text fields
    const validatedFields = createDonationConfirmationSchema.safeParse({
      donorName: rawDonorName?.toString(),
      donorAddress: rawDonorAddress?.toString() || undefined,
      donorPhone: rawDonorPhone?.toString() || undefined,
      isAnonymous: rawIsAnonymous,
      amount: rawAmount ? parseInt(rawAmount.toString(), 10) : 0,
      transferDate: rawTransferDate?.toString(),
      paymentChannel: rawPaymentChannel?.toString(),
    })

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors
      const firstErrorMessage = Object.values(errors).flat()[0] || "Validasi input gagal."
      return { success: false, error: firstErrorMessage }
    }

    const data = validatedFields.data

    // 3. Handle base64 encoded file uploads
    // Client sends: fileData_{i} (base64), fileType_{i} (mime), fileName_{i} (name)
    const proofUrls: string[] = []
    let fileIndex = 0

    while (formData.get(`fileData_${fileIndex}`) !== null) {
      const base64Data = formData.get(`fileData_${fileIndex}`) as string
      const fileType = formData.get(`fileType_${fileIndex}`) as string
      const fileName = formData.get(`fileName_${fileIndex}`) as string

      if (!base64Data || !fileType) {
        fileIndex++
        continue
      }

      // Validate MIME type
      if (!fileType.startsWith('image/')) {
        return {
          success: false,
          error: `File "${fileName}" harus berupa file gambar (JPG/PNG/WebP).`
        }
      }

      // Convert base64 to Buffer
      const base64Content = base64Data.split(',')[1] || base64Data
      const buffer = Buffer.from(base64Content, 'base64')

      // Validate file size (10MB)
      if (buffer.byteLength > 10 * 1024 * 1024) {
        return {
          success: false,
          error: `File "${fileName}" melebihi ukuran maksimal 10MB.`
        }
      }

      // Upload to Supabase Storage
      const fileExt = fileName.split('.').pop() || 'jpg'
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `pemasukan/${cleanFileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, buffer, {
          contentType: fileType,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return {
          success: false,
          error: `Gagal mengunggah bukti transfer: ${uploadError.message}`
        }
      }

      proofUrls.push(uploadData.path)
      fileIndex++
    }

    // 4. Check at least one file uploaded
    if (proofUrls.length === 0) {
      return {
        success: false,
        error: "Silakan unggah minimal satu foto bukti transfer."
      }
    }

    // 5. Save to database
    const confirmation = await db.donationConfirmation.create({
      data: {
        donorName: data.donorName,
        donorAddress: data.donorAddress || null,
        donorPhone: data.donorPhone || null,
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
