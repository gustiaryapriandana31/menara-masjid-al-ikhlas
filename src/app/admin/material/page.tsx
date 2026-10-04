import db from '@/lib/db'
import MaterialClient from './material-client'
import { safeDateToIso } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Donasi Material - Panel Panitia',
  description: 'Catat manual penerimaan donasi berupa barang/material untuk pembangunan Menara.'
}

export default async function MaterialPage() {
  // Fetch 7 most recent material donations sorted by date DESC NULLS LAST
  const recentMaterials = await db.$queryRaw<{
    id: string
    donorName: string
    materialName: string
    quantity: string
    date: Date | null
    description: string | null
    createdAt: Date
  }[]>`
    SELECT id, "donorName", "materialName", quantity, date, description, "createdAt"
    FROM "MaterialDonation"
    ORDER BY date DESC NULLS LAST
    LIMIT 7
  `

  const serializedRecentMaterials = recentMaterials.map(item => ({
    id: item.id,
    donorName: item.donorName,
    materialName: item.materialName,
    quantity: item.quantity,
    date: safeDateToIso(item.date) || safeDateToIso(item.createdAt),
    description: item.description || ''
  }))

  return <MaterialClient recentMaterials={serializedRecentMaterials} />
}
