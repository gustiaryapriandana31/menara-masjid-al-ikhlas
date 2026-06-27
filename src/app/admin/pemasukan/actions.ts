"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { uploadReceipt, getSignedReceiptUrl } from '@/lib/storage'

// Define validation schema using Zod
const createPemasukanSchema = z.object({
  amount: z.number().positive("Nominal pemasukan harus lebih dari Rp 0"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal penerimaan tidak valid"
  }),
  donorName: z.string()
    .min(3, "Nama Donatur minimal 3 karakter")
    .max(255, "Nama Donatur terlalu panjang (maksimal 255 karakter)"),
  donorAddress: z.string().max(500, "Alamat terlalu panjang (maksimal 500 karakter)").optional().nullable().or(z.literal('')),
  description: z.string().max(500, "Keterangan terlalu panjang (maksimal 500 karakter)").optional().nullable().or(z.literal('')),
  isAnonymous: z.boolean().default(false)
})

/**
 * Server Action to validate and save manual income (pemasukan) transaction.
 */
export async function createPemasukan(prevState: unknown, formData: FormData) {
  try {
    // 1. Extract values from FormData
    const rawAmount = formData.get('amount')
    const rawDate = formData.get('date')
    const rawDonorName = formData.get('donorName')
    const rawDonorAddress = formData.get('donorAddress')
    const rawDescription = formData.get('description')
    const rawIsAnonymous = formData.get('isAnonymous') === 'true'
    const files = formData.getAll('files') as File[]

    // 2. Validate input fields using Zod
    const validatedFields = createPemasukanSchema.safeParse({
      amount: rawAmount ? parseInt(rawAmount.toString(), 10) : 0,
      date: rawDate?.toString(),
      donorName: rawIsAnonymous ? "Hamba Allah" : rawDonorName?.toString(),
      donorAddress: rawIsAnonymous ? null : rawDonorAddress?.toString() || null,
      description: rawDescription?.toString() || null,
      isAnonymous: rawIsAnonymous
    })

    if (!validatedFields.success) {
      // Collect and return Zod validation errors
      const errors = validatedFields.error.flatten().fieldErrors
      const firstErrorMessage = Object.values(errors).flat()[0] || "Validasi input gagal."
      return {
        success: false,
        error: firstErrorMessage
      }
    }

    const data = validatedFields.data

    // 3. Process file uploads if files are provided
    const receiptUrls: string[] = []
    
    // Check if the user opted to upload files
    const hasFiles = formData.get('addReceipt') === 'true'
    if (hasFiles && files.length > 0) {
      for (const file of files) {
        // Skip empty entries
        if (!file || file.size === 0) continue

        // Server-side validation for file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          return {
            success: false,
            error: `File "${file.name}" melebihi ukuran maksimal 10MB.`
          }
        }

        // Server-side validation for file type (Images only)
        if (!file.type.startsWith('image/')) {
          return {
            success: false,
            error: `File "${file.name}" tidak diizinkan. Hanya file gambar (JPG/PNG/WebP) yang diperbolehkan.`
          }
        }

        // Upload to Supabase Storage and collect the internal path
        const uploadedPath = await uploadReceipt(file)
        receiptUrls.push(uploadedPath)
      }

      // If the user checked addReceipt but no files were successfully processed
      if (receiptUrls.length === 0) {
        return {
          success: false,
          error: "Silakan unggah minimal satu bukti terima karena Anda mengaktifkan opsi Bukti Terima."
        }
      }
    }

    // 4. Save the transaction to the database via Prisma (Income Table)
    const incomeRecord = await db.income.create({
      data: {
        donorName: data.isAnonymous ? "Hamba Allah" : data.donorName,
        donorAddress: data.isAnonymous ? null : data.donorAddress,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
        type: 'CASH', // Form pemasukan manual dari admin diset sebagai CASH
        receiptUrls: receiptUrls,
      }
    })

    return {
      success: true,
      data: {
        id: incomeRecord.id
      }
    }

  } catch (err) {
    console.error("Error creating income transaction:", err)
    return {
      success: false,
      error: "Gagal menyimpan data pemasukan ke database. Silakan coba beberapa saat lagi."
    }
  }
}

/**
 * Server Action to generate temporary signed URLs for a list of private image paths.
 */
export async function getSignedUrls(paths: string[]) {
  try {
    if (!paths || paths.length === 0) {
      return { success: true, urls: [] }
    }
    
    const urls = await Promise.all(
      paths.map(async (path) => {
        return await getSignedReceiptUrl(path)
      })
    )
    
    return { success: true, urls }
  } catch (err) {
    console.error("Error generating signed URLs:", err)
    return {
      success: false,
      error: "Gagal memuat gambar bukti terima. Silakan muat ulang halaman."
    }
  }
}
