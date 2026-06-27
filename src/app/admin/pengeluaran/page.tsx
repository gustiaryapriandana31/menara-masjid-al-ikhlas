import db from '@/lib/db'
import PengeluaranClient from './pengeluaran-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Catat Pengeluaran - Panel Panitia',
  description: 'Catat manual belanja keperluan pembangunan Menara Masjid Al-Ikhlas.'
}

export default async function PengeluaranPage() {
  // Fetch the last 5 outcomes ordered by date descending
  const recentOutcomes = await db.outcome.findMany({
    take: 5,
    orderBy: {
      date: 'desc'
    }
  })

  // Serialize the data for Client Component compatibility
  const serializedRecentOutcomes = recentOutcomes.map(item => ({
    id: item.id,
    buyer: item.buyer,
    amount: Number(item.amount),
    date: item.date.toISOString(),
    category: item.category,
    description: item.description
  }))

  return <PengeluaranClient recentOutcomes={serializedRecentOutcomes} />
}
