"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { uploadReceipt, getSignedReceiptUrl } from '@/lib/storage'

// ─── Zod Validation Schema ────────────────────────────────────────────────────
const createMaterialSchema = z.object({
  donorName: z
    .string()
    .min(3, "Nama Donatur minimal 3 karakter")
    .max(255, "Nama Donatur terlalu panjang (maksimal 255 karakter)"),
  isAnonymous: z.boolean().default(false),
  donorAddress: z
    .string()
    .max(500, "Alamat terlalu panjang (maksimal 500 karakter)")
    .optional()
    .nullable()
    .or(z.literal('')),
  donorPhone: z
    .string()
    .max(20, "Nomor telepon tidak valid")
    .optional()
    .nullable()
    .or(z.literal('')),
  materialName: z
    .string()
    .min(2, "Nama material minimal 2 karakter")
    .max(255, "Nama material terlalu panjang (maksimal 255 karakter)"),
  quantity: z
    .string()
    .min(1, "Jumlah/volume material tidak boleh kosong")
    .max(100, "Jumlah material terlalu panjang (maksimal 100 karakter)"),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal penerimaan tidak valid"
    }),
  description: z
    .string()
    .max(500, "Keterangan terlalu panjang (maksimal 500 karakter)")
    .optional()
    .nullable()
    .or(z.literal('')),
})

// ─── Create Material Donation ─────────────────────────────────────────────────
/**
 * Server Action to validate and save a material donation record.
 */
export async function createMaterialDonation(prevState: unknown, formData: FormData) {
  try {
    const rawIsAnonymous = formData.get('isAnonymous') === 'true'
    const rawDonorName   = formData.get('donorName')
    const rawDonorAddress = formData.get('donorAddress')
    const rawDonorPhone  = formData.get('donorPhone')
    const rawMaterialName = formData.get('materialName')
    const rawQuantity    = formData.get('quantity')
    const rawDate        = formData.get('date')
    const rawDescription = formData.get('description')
    const files          = formData.getAll('files') as File[]

    // Zod validation
    const validated = createMaterialSchema.safeParse({
      donorName:    rawIsAnonymous ? "Hamba Allah" : rawDonorName?.toString(),
      isAnonymous:  rawIsAnonymous,
      donorAddress: rawDonorAddress?.toString() || null,
      donorPhone:   rawDonorPhone?.toString() || null,
      materialName: rawMaterialName?.toString(),
      quantity:     rawQuantity?.toString(),
      date:         rawDate?.toString(),
      description:  rawDescription?.toString() || null,
    })

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0] || "Validasi input gagal."
      return { success: false, error: firstError }
    }

    const data = validated.data

    // ── Upload files ──────────────────────────────────────────────────────────
    const receiptUrls: string[] = []
    const hasFiles = formData.get('addReceipt') === 'true'

    if (hasFiles && files.length > 0) {
      for (const file of files) {
        if (!file || file.size === 0) continue

        if (file.size > 10 * 1024 * 1024) {
          return {
            success: false,
            error: `File "${file.name}" melebihi ukuran maksimal 10MB.`
          }
        }

        if (!file.type.startsWith('image/')) {
          return {
            success: false,
            error: `File "${file.name}" tidak diizinkan. Hanya file gambar (JPG/PNG/WebP) yang diperbolehkan.`
          }
        }

        const uploadedPath = await uploadReceipt(file)
        receiptUrls.push(uploadedPath)
      }

      if (receiptUrls.length === 0) {
        return {
          success: false,
          error: "Silakan unggah minimal satu bukti dokumentasi karena Anda mengaktifkan opsi Bukti Dokumentasi."
        }
      }
    }

    // ── Save to DB ────────────────────────────────────────────────────────────
    const record = await db.materialDonation.create({
      data: {
        donorName:    data.isAnonymous ? "Hamba Allah" : data.donorName,
        isAnonymous:  data.isAnonymous,
        donorAddress: data.donorAddress || null,
        donorPhone:   data.donorPhone || null,
        materialName: data.materialName,
        quantity:     data.quantity,
        date:         new Date(data.date),
        description:  data.description || null,
        receiptUrls,
      }
    })

    return { success: true, data: { id: record.id } }

  } catch (err) {
    console.error("Error creating material donation:", err)
    return {
      success: false,
      error: "Gagal menyimpan data donasi material ke database. Silakan coba beberapa saat lagi."
    }
  }
}

// ─── Get Signed URLs ──────────────────────────────────────────────────────────
/**
 * Generate temporary signed URLs for viewing private receipt images.
 */
export async function getMaterialSignedUrls(paths: string[]) {
  try {
    if (!paths || paths.length === 0) return { success: true, urls: [] }

    const urls = await Promise.all(
      paths.map((path) => getSignedReceiptUrl(path))
    )
    return { success: true, urls }
  } catch (err) {
    console.error("Error generating signed URLs:", err)
    return {
      success: false,
      error: "Gagal memuat gambar dokumentasi. Silakan muat ulang halaman."
    }
  }
}
