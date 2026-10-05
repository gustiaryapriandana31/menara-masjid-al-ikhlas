import db from '@/lib/db'
import LaporanPublicClient from './laporan-public-client'
import { LaporanPageJsonLd } from '@/components/shared/json-ld'
import { safeDateToIso } from '@/lib/utils'
import { aggregateQuantities } from '@/lib/format'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Laporan Keuangan & Transparansi – Menara Masjid Al-Ikhlas',
  description:
    'Laporan keuangan transparan pembangunan Menara Masjid Al-Ikhlas. Lihat total saldo kas, riwayat donasi, grafik bulanan, dan alokasi pengeluaran secara real-time.',
  keywords: [
    'laporan keuangan masjid',
    'transparansi dana masjid al ikhlas',
    'saldo kas masjid',
    'riwayat donasi masjid al ikhlas',
    'laporan donasi masjid',
    'keuangan pembangunan menara masjid',
  ],
  alternates: {
    canonical: 'https://menara-masjid-al-ikhlas.vercel.app/laporan-keuangan',
  },
  openGraph: {
    title: 'Laporan Keuangan & Transparansi – Menara Masjid Al-Ikhlas',
    description:
      'Pantau saldo kas, riwayat donasi, dan pengeluaran pembangunan Menara Masjid Al-Ikhlas secara transparan.',
    url: 'https://menara-masjid-al-ikhlas.vercel.app/laporan-keuangan',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function PublicLaporanPage() {
  // 1. Total Pemasukan Tunai
  const cashAgg = await db.income.aggregate({
    _sum: { amount: true },
    where: { type: 'CASH' }
  })
  const totalCash = Number(cashAgg._sum.amount || 0)

  // 2. Total Pemasukan Transfer
  const transferAgg = await db.income.aggregate({
    _sum: { amount: true },
    where: { type: 'TRANSFER' }
  })
  const totalTransfer = Number(transferAgg._sum.amount || 0)

  // 2b. Kelompokkan Transfer per Saluran Pembayaran
  const channelGroup = await db.donationConfirmation.groupBy({
    by: ['paymentChannel'],
    _sum: { amount: true },
    where: { status: 'APPROVED' }
  })

  const transferChannels = {
    SUMSEL_BABEL_SYARIAH: 0,
    BSI: 0,
    MANDIRI: 0,
    BCA: 0,
    BRI: 0,
    BNI: 0,
    QRIS: 0,
    OTHER: 0
  }

  channelGroup.forEach(group => {
    const ch = group.paymentChannel as keyof typeof transferChannels
    if (ch in transferChannels) {
      transferChannels[ch] = Number(group._sum.amount || 0)
    }
  })

  // 3. Total Pengeluaran
  const outcomeAgg = await db.outcome.aggregate({ _sum: { amount: true } })
  const totalExpense = Number(outcomeAgg._sum.amount || 0)

  // 4. Pengeluaran per Kategori
  const categoryGroup = await db.outcome.groupBy({
    by: ['category'],
    _sum: { amount: true }
  })

  const expenseCategories = { MATERIAL: 0, LABOR: 0, OPERATIONAL: 0, OTHER: 0 }
  categoryGroup.forEach(group => {
    if (group.category in expenseCategories) {
      expenseCategories[group.category as keyof typeof expenseCategories] = Number(group._sum.amount || 0)
    }
  })

  // 5. Data Bulanan Tahun Berjalan untuk Grafik
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)

  const incomesForYear = await db.income.findMany({
    where: { date: { gte: startOfYear, lte: endOfYear } },
    select: { amount: true, date: true }
  })
  const outcomesForYear = await db.outcome.findMany({
    where: { date: { gte: startOfYear, lte: endOfYear } },
    select: { amount: true, date: true }
  })

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
  const monthlyTrend = MONTH_LABELS.map((label, index) => {
    const sumIncome = incomesForYear
      .filter(item => item.date?.getMonth() === index)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)
    const sumOutcome = outcomesForYear
      .filter(item => item.date.getMonth() === index)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)
    return { label, income: sumIncome, expense: sumOutcome }
  })

  // 6. Donasi Material – semua data, diurutkan berdasarkan tanggal terbaru
  const rawMaterials = await db.$queryRaw<{
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
  `

  const materialDonations = rawMaterials.map(item => ({
    id: item.id,
    donorName: item.donorName,
    materialName: item.materialName,
    quantity: item.quantity,
    date: safeDateToIso(item.date) || null,
    description: item.description || null,
  }))

  // Agregasi Material per Jenis Material & Kuantitas
  const materialGroupMap = new Map<string, { name: string; count: number; quantities: string[]; donors: Set<string> }>()
  rawMaterials.forEach(m => {
    const name = m.materialName.trim()
    const key = name.toLowerCase()
    if (!materialGroupMap.has(key)) {
      materialGroupMap.set(key, {
        name,
        count: 1,
        quantities: m.quantity ? [m.quantity.trim()] : [],
        donors: new Set([m.donorName.trim().toLowerCase()])
      })
    } else {
      const existing = materialGroupMap.get(key)!
      existing.count += 1
      if (m.quantity) {
        existing.quantities.push(m.quantity.trim())
      }
      existing.donors.add(m.donorName.trim().toLowerCase())
    }
  })

  const materialTypes = Array.from(materialGroupMap.values())
    .map(item => ({
      name: item.name,
      count: item.count,
      quantities: item.quantities,
      totalQuantityDisplay: aggregateQuantities(item.quantities),
      donorCount: item.donors.size
    }))
    .sort((a, b) => b.count - a.count)

  const topMaterials = materialTypes.slice(0, 5).map(m => ({ name: m.name, count: m.count }))

  const materialStats = {
    totalTrans: rawMaterials.length,
    totalTypes: materialGroupMap.size,
    totalDonors: new Set(rawMaterials.map(m => m.donorName.trim().toLowerCase())).size,
    topMaterials,
    materialTypes
  }

  return (
    <>
      <LaporanPageJsonLd />
      <LaporanPublicClient
        totalCash={totalCash}
        totalTransfer={totalTransfer}
        totalExpense={totalExpense}
        expenseCategories={expenseCategories}
        transferChannels={transferChannels}
        monthlyTrend={monthlyTrend}
        materialDonations={materialDonations}
        materialStats={materialStats}
      />
    </>
  )
}
