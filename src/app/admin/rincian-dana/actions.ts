"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { DonationStatus, IncomeType, ExpenseCategory } from "@prisma/client"
import { z } from "zod"
import { uploadReceipt } from "@/lib/storage"

// Validation Schemas
const updateIncomeSchema = z.object({
  id: z.string().min(1, "ID transaksi tidak valid"),
  amount: z.number().positive("Nominal pemasukan harus lebih dari Rp 0"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal penerimaan tidak valid"
  }),
  donorName: z.string()
    .min(3, "Nama Donatur minimal 3 karakter")
    .max(255, "Nama Donatur terlalu panjang (maksimal 255 karakter)"),
  donorAddress: z.string().max(500, "Alamat terlalu panjang (maksimal 500 karakter)").optional().nullable().or(z.literal('')),
  donorPhone: z.string().max(20, "Nomor telepon tidak valid").optional().nullable().or(z.literal('')),
  description: z.string().max(500, "Keterangan terlalu panjang (maksimal 500 karakter)").optional().nullable().or(z.literal('')),
  type: z.nativeEnum(IncomeType),
  isAnonymous: z.boolean().default(false)
})

const updateOutcomeSchema = z.object({
  id: z.string().min(1, "ID transaksi tidak valid"),
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
 * Server Action to update an Income record.
 */
export async function updateIncomeAction(formData: FormData) {
  try {
    const rawId = formData.get("id")?.toString()
    const rawAmount = formData.get("amount")?.toString()
    const rawDate = formData.get("date")?.toString()
    const rawDonorName = formData.get("donorName")?.toString()
    const rawDonorAddress = formData.get("donorAddress")?.toString()
    const rawDonorPhone = formData.get("donorPhone")?.toString()
    const rawDescription = formData.get("description")?.toString()
    const rawType = formData.get("type")?.toString()
    const rawIsAnonymous = formData.get("isAnonymous") === "true"
    const rawExistingReceiptUrls = formData.get("existingReceiptUrls")?.toString()
    const files = formData.getAll("files") as File[]

    const validated = updateIncomeSchema.safeParse({
      id: rawId,
      amount: rawAmount ? parseInt(rawAmount, 10) : 0,
      date: rawDate,
      donorName: rawIsAnonymous ? "Hamba Allah" : rawDonorName,
      donorAddress: rawDonorAddress || null,
      donorPhone: rawDonorPhone || null,
      description: rawDescription || null,
      type: rawType || "CASH",
      isAnonymous: rawIsAnonymous
    })

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0] || "Validasi data gagal."
      return { success: false, error: firstError }
    }

    const data = validated.data

    // Existing receipt URLs array
    let finalReceiptUrls: string[] = []
    if (rawExistingReceiptUrls) {
      try {
        finalReceiptUrls = JSON.parse(rawExistingReceiptUrls)
      } catch {
        finalReceiptUrls = []
      }
    }

    // Process newly uploaded files
    if (files && files.length > 0) {
      for (const file of files) {
        if (!file || file.size === 0) continue
        if (file.size > 10 * 1024 * 1024) {
          return { success: false, error: `File "${file.name}" melebihi ukuran maksimal 10MB.` }
        }
        if (!file.type.startsWith("image/")) {
          return { success: false, error: `File "${file.name}" harus berupa file gambar (JPG/PNG/WebP).` }
        }
        const uploadedPath = await uploadReceipt(file)
        finalReceiptUrls.push(uploadedPath)
      }
    }

    // Check if income exists
    const existingIncome = await db.income.findUnique({
      where: { id: data.id }
    })

    if (!existingIncome) {
      return { success: false, error: "Data pemasukan tidak ditemukan." }
    }

    // Update income record in DB
    await db.income.update({
      where: { id: data.id },
      data: {
        donorName: data.isAnonymous ? "Hamba Allah" : data.donorName,
        donorAddress: data.donorAddress,
        donorPhone: data.donorPhone,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
        type: data.type,
        receiptUrls: finalReceiptUrls
      }
    })

    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/validasi")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating income record:", error)
    return { success: false, error: error.message || "Gagal memperbarui data pemasukan." }
  }
}

/**
 * Server Action to update an Outcome record.
 */
export async function updateOutcomeAction(formData: FormData) {
  try {
    const rawId = formData.get("id")?.toString()
    const rawAmount = formData.get("amount")?.toString()
    const rawDate = formData.get("date")?.toString()
    const rawCategory = formData.get("category")?.toString()
    const rawBuyer = formData.get("buyer")?.toString()
    const rawDescription = formData.get("description")?.toString()
    const rawExistingReceiptUrls = formData.get("existingReceiptUrls")?.toString()
    const files = formData.getAll("files") as File[]

    const validated = updateOutcomeSchema.safeParse({
      id: rawId,
      amount: rawAmount ? parseInt(rawAmount, 10) : 0,
      date: rawDate,
      category: rawCategory,
      buyer: rawBuyer,
      description: rawDescription
    })

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0] || "Validasi data gagal."
      return { success: false, error: firstError }
    }

    const data = validated.data

    // Existing receipt URLs array
    let finalReceiptUrls: string[] = []
    if (rawExistingReceiptUrls) {
      try {
        finalReceiptUrls = JSON.parse(rawExistingReceiptUrls)
      } catch {
        finalReceiptUrls = []
      }
    }

    // Process newly uploaded files
    if (files && files.length > 0) {
      for (const file of files) {
        if (!file || file.size === 0) continue
        if (file.size > 10 * 1024 * 1024) {
          return { success: false, error: `File "${file.name}" melebihi ukuran maksimal 10MB.` }
        }
        if (!file.type.startsWith("image/")) {
          return { success: false, error: `File "${file.name}" harus berupa file gambar (JPG/PNG/WebP).` }
        }
        const uploadedPath = await uploadReceipt(file)
        finalReceiptUrls.push(uploadedPath)
      }
    }

    // Check if outcome exists
    const existingOutcome = await db.outcome.findUnique({
      where: { id: data.id }
    })

    if (!existingOutcome) {
      return { success: false, error: "Data pengeluaran tidak ditemukan." }
    }

    // Update outcome record in DB
    await db.outcome.update({
      where: { id: data.id },
      data: {
        buyer: data.buyer,
        amount: data.amount,
        date: new Date(data.date),
        category: data.category,
        description: data.description,
        receiptUrls: finalReceiptUrls
      }
    })

    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating outcome record:", error)
    return { success: false, error: error.message || "Gagal memperbarui data pengeluaran." }
  }
}

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

const updateMaterialSchema = z.object({
  id: z.string().min(1, "ID donasi material tidak valid"),
  materialName: z.string().min(2, "Nama material minimal 2 karakter").max(255, "Nama material terlalu panjang"),
  quantity: z.string().min(1, "Jumlah/volume material tidak boleh kosong").max(100, "Jumlah material terlalu panjang"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal penerimaan tidak valid"
  }),
  donorName: z.string().min(3, "Nama Donatur minimal 3 karakter").max(255, "Nama Donatur terlalu panjang"),
  donorAddress: z.string().max(500, "Alamat terlalu panjang").optional().nullable().or(z.literal('')),
  donorPhone: z.string().max(20, "Nomor telepon tidak valid").optional().nullable().or(z.literal('')),
  description: z.string().max(500, "Keterangan terlalu panjang").optional().nullable().or(z.literal('')),
  isAnonymous: z.boolean().default(false)
})

/**
 * Server Action to update a Material Donation record.
 */
export async function updateMaterialAction(formData: FormData) {
  try {
    const rawId = formData.get("id")?.toString()
    const rawMaterialName = formData.get("materialName")?.toString()
    const rawQuantity = formData.get("quantity")?.toString()
    const rawDate = formData.get("date")?.toString()
    const rawDonorName = formData.get("donorName")?.toString()
    const rawDonorAddress = formData.get("donorAddress")?.toString()
    const rawDonorPhone = formData.get("donorPhone")?.toString()
    const rawDescription = formData.get("description")?.toString()
    const rawIsAnonymous = formData.get("isAnonymous") === "true"
    const rawExistingReceiptUrls = formData.get("existingReceiptUrls")?.toString()
    const files = formData.getAll("files") as File[]

    const validated = updateMaterialSchema.safeParse({
      id: rawId,
      materialName: rawMaterialName,
      quantity: rawQuantity,
      date: rawDate,
      donorName: rawIsAnonymous ? "Hamba Allah" : rawDonorName,
      donorAddress: rawDonorAddress || null,
      donorPhone: rawDonorPhone || null,
      description: rawDescription || null,
      isAnonymous: rawIsAnonymous
    })

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0] || "Validasi data gagal."
      return { success: false, error: firstError }
    }

    const data = validated.data

    let finalReceiptUrls: string[] = []
    if (rawExistingReceiptUrls) {
      try {
        finalReceiptUrls = JSON.parse(rawExistingReceiptUrls)
      } catch {
        finalReceiptUrls = []
      }
    }

    if (files && files.length > 0) {
      for (const file of files) {
        if (!file || file.size === 0) continue
        if (file.size > 10 * 1024 * 1024) {
          return { success: false, error: `File "${file.name}" melebihi ukuran maksimal 10MB.` }
        }
        if (!file.type.startsWith("image/")) {
          return { success: false, error: `File "${file.name}" harus berupa file gambar (JPG/PNG/WebP).` }
        }
        const uploadedPath = await uploadReceipt(file)
        finalReceiptUrls.push(uploadedPath)
      }
    }

    const existingMaterial = await db.materialDonation.findUnique({
      where: { id: data.id }
    })

    if (!existingMaterial) {
      return { success: false, error: "Data donasi material tidak ditemukan." }
    }

    await db.materialDonation.update({
      where: { id: data.id },
      data: {
        donorName: data.isAnonymous ? "Hamba Allah" : data.donorName,
        isAnonymous: data.isAnonymous,
        donorAddress: data.donorAddress,
        donorPhone: data.donorPhone,
        materialName: data.materialName,
        quantity: data.quantity,
        date: new Date(data.date),
        description: data.description,
        receiptUrls: finalReceiptUrls
      }
    })

    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating material donation record:", error)
    return { success: false, error: error.message || "Gagal memperbarui data donasi material." }
  }
}

/**
 * Server Action to delete a Material Donation record.
 */
export async function deleteMaterialAction(id: string) {
  try {
    const material = await db.materialDonation.findUnique({
      where: { id }
    })

    if (!material) {
      throw new Error("Donasi material tidak ditemukan.")
    }

    await db.materialDonation.delete({
      where: { id }
    })

    revalidatePath("/admin/rincian-dana")
    revalidatePath("/admin/laporan-keuangan")
    revalidatePath("/laporan-keuangan")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting material donation:", error)
    return { success: false, error: error.message || "Gagal menghapus data donasi material." }
  }
}

