import db from '@/lib/db'
import RincianDanaClient from './rincian-dana-client'
import { safeDateToIso } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Rincian Dana - Panel Panitia',
  description: 'Rincian transaksi pemasukan dan pengeluaran kas pembangunan Menara Masjid Al-Ikhlas.'
}

export default async function RincianDanaPage() {
  // Fetch incomes ordered by date descending
  const incomes = await db.income.findMany({
    orderBy: { date: 'desc' }
  })

  // Fetch outcomes ordered by date descending
  const outcomes = await db.outcome.findMany({
    orderBy: { date: 'desc' }
  })

  // Fetch material donations ordered by date descending
  const materials = await db.materialDonation.findMany({
    orderBy: { date: 'desc' }
  })

  // Serialize Prisma models (Decimal and DateTime) for Client Component compatibility
  const serializedIncomes = incomes.map(item => ({
    id: item.id,
    donorName: item.donorName,
    donorAddress: item.donorAddress || '',
    donorPhone: item.donorPhone || '',
    amount: Number(item.amount),
    date: safeDateToIso(item.date) || safeDateToIso(item.createdAt),
    description: item.description || '',
    type: item.type,
    receiptUrls: item.receiptUrls || [],
    donationConfirmationId: item.donationConfirmationId
  }))

  const serializedOutcomes = outcomes.map(item => ({
    id: item.id,
    buyer: item.buyer,
    amount: Number(item.amount),
    date: safeDateToIso(item.date) || safeDateToIso(item.createdAt),
    description: item.description || '',
    category: item.category,
    receiptUrls: item.receiptUrls || []
  }))

  const serializedMaterials = materials.map(item => ({
    id: item.id,
    donorName: item.donorName,
    donorAddress: item.donorAddress || '',
    donorPhone: item.donorPhone || '',
    materialName: item.materialName,
    quantity: item.quantity,
    date: safeDateToIso(item.date) || safeDateToIso(item.createdAt),
    description: item.description || '',
    receiptUrls: item.receiptUrls || []
  }))

  return (
    <RincianDanaClient
      incomes={serializedIncomes}
      outcomes={serializedOutcomes}
      materials={serializedMaterials}
    />
  )
}
