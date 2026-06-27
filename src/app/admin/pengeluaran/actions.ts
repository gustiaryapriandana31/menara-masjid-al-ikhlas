"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { uploadReceipt } from '@/lib/storage'
import { ExpenseCategory } from '@prisma/client'

// Define validation schema using Zod
const createPengeluaranSchema = z.object({
  amount: z.number().positive("Nominal pengeluaran harus lebih dari Rp 0"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal pengeluaran tidak valid"
  }),
  category: z.nativeEnum(ExpenseCategory),
  buyer: z.string()
    .min(3, "Nama penanggung jawab minimal 3 karakter")
    .max(255, "Nama penanggung jawab terlalu panjang"),
  description: z.string()
    .min(3, "Keterangan pengeluaran minimal 3 karakter")
    .max(500, "Keterangan terlalu panjang (maksimal 500 karakter)")
})

/**
 * Server Action to validate and save manual outcome (pengeluaran) transaction.
 */
export async function createPengeluaran(prevState: unknown, formData: FormData) {
  try {
    // 1. Extract values from FormData
    const rawAmount = formData.get('amount')
    const rawDate = formData.get('date')
    const rawCategory = formData.get('category')
    const rawBuyer = formData.get('buyer')
    const rawDescription = formData.get('description')
    const files = formData.getAll('files') as File[]

    // 2. Validate input fields using Zod
    const validatedFields = createPengeluaranSchema.safeParse({
      amount: rawAmount ? parseInt(rawAmount.toString(), 10) : 0,
      date: rawDate?.toString(),
      category: rawCategory?.toString(),
      buyer: rawBuyer?.toString(),
      description: rawDescription?.toString()
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

    // 3. Process file uploads (Images only)
    const receiptUrls: string[] = []
    
    if (files.length > 0) {
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
    }

    // 4. Save the transaction to the database via Prisma (Outcome Table)
    const outcomeRecord = await db.outcome.create({
      data: {
        buyer: data.buyer,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        receiptUrls: receiptUrls,
      }
    })

    return {
      success: true,
      data: {
        id: outcomeRecord.id
      }
    }

  } catch (err) {
    console.error("Error creating outcome transaction:", err)
    return {
      success: false,
      error: "Gagal menyimpan data pengeluaran ke database. Silakan coba beberapa saat lagi."
    }
  }
}
