import db from '@/lib/db'
import PemasukanClient from './pemasukan-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Catat Pemasukan - Panel Panitia',
  description: 'Catat manual penerimaan dana secara luring (Cash) ke kas pembangunan Menara.'
}

export default async function PemasukanPage() {
  // Fetch the last 5 manual cash incomes
  const recentIncomes = await db.income.findMany({
    where: {
      type: 'CASH'
    },
    take: 5,
    orderBy: {
      date: 'desc'
    }
  })

  // Serialize the data for Client Component compatibility
  const serializedRecentIncomes = recentIncomes.map(item => ({
    id: item.id,
    donorName: item.donorName,
    amount: Number(item.amount),
    date: item.date.toISOString(),
    type: item.type,
    description: item.description || ''
  }))

  return <PemasukanClient recentIncomes={serializedRecentIncomes} />
}
