import db from '@/lib/db'
import PemasukanClient from './pemasukan-client'
import { safeDateToIso } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Catat Pemasukan - Panel Panitia',
  description: 'Catat manual penerimaan dana secara Tunai (cash) ke kas pembangunan Menara.'
}

export default async function PemasukanPage() {
  // Fetch 7 most recent incomes sorted by actual transaction date (date field),
  // falling back to createdAt for records where date is null.
  // Using raw SQL because Prisma's orderBy doesn't support NULLS LAST / COALESCE.
  const recentIncomes = await db.$queryRaw<{
    id: string
    donorName: string
    amount: string
    date: Date | null
    type: string
    description: string | null
    createdAt: Date
    receiptUrls: string[] | null
    donationConfirmationId: string | null
  }[]>`
    SELECT id, "donorName", amount::text, date, type, description, "createdAt", "receiptUrls", "donationConfirmationId"
    FROM "Income"
    ORDER BY 
      date DESC NULLS LAST,
      CASE WHEN LOWER(TRIM("donorName")) = 'hamba allah' THEN 1 ELSE 0 END ASC,
      CASE WHEN ("receiptUrls" IS NOT NULL AND array_length("receiptUrls", 1) > 0) OR "donationConfirmationId" IS NOT NULL THEN 0 ELSE 1 END ASC,
      "createdAt" DESC
    LIMIT 10
  `

  // Serialize the data for Client Component compatibility
  const serializedRecentIncomes = recentIncomes.map(item => ({
    id: item.id,
    donorName: item.donorName,
    amount: Number(item.amount),
    date: safeDateToIso(item.date) || safeDateToIso(item.createdAt),
    type: item.type as 'CASH' | 'TRANSFER',
    description: item.description || '',
    receiptUrls: item.receiptUrls || [],
    donationConfirmationId: item.donationConfirmationId
  }))

  return <PemasukanClient recentIncomes={serializedRecentIncomes} />
}
