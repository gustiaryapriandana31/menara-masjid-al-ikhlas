import db from '@/lib/db'
import LaporanPublicClient from './laporan-public-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Laporan Keuangan & Transparansi - Menara Al-Ikhlas',
  description: 'Informasi transparansi saldo kas, grafik bulanan, dan log rincian transaksi pembangunan Menara Masjid Al-Ikhlas.'
}

export default async function PublicLaporanPage() {
  // 1. Ambil jumlah nominal Pemasukan Kas Tunai (CASH)
  const cashAgg = await db.income.aggregate({
    _sum: { amount: true },
    where: { type: 'CASH' }
  })
  const totalCash = Number(cashAgg._sum.amount || 0)

  // 2. Ambil jumlah nominal Pemasukan Kas Transfer (TRANSFER)
  const transferAgg = await db.income.aggregate({
    _sum: { amount: true },
    where: { type: 'TRANSFER' }
  })
  const totalTransfer = Number(transferAgg._sum.amount || 0)

  // 2b. Kelompokkan Pemasukan Transfer berdasarkan Saluran Pembayaran (Payment Channel)
  const channelGroup = await db.donationConfirmation.groupBy({
    by: ['paymentChannel'],
    _sum: { amount: true },
    where: { status: 'APPROVED' }
  })

  // Inisialisasi default nominal per saluran transfer
  let transferChannels = {
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

  // 3. Ambil jumlah nominal Pengeluaran Belanja (OUTCOME)
  const outcomeAgg = await db.outcome.aggregate({
    _sum: { amount: true }
  })
  const totalExpense = Number(outcomeAgg._sum.amount || 0)

  // 4. Ambil jumlah pengeluaran dikelompokkan berdasarkan Kategori Belanja
  const categoryGroup = await db.outcome.groupBy({
    by: ['category'],
    _sum: { amount: true }
  })

  let expenseCategories = {
    MATERIAL: 0,
    LABOR: 0,
    OPERATIONAL: 0,
    OTHER: 0
  }

  categoryGroup.forEach(group => {
    if (group.category in expenseCategories) {
      expenseCategories[group.category as keyof typeof expenseCategories] = Number(group._sum.amount || 0)
    }
  })

  // 5. Ambil data bulanan sepanjang tahun berjalan untuk grafik batang
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)

  const incomesForYear = await db.income.findMany({
    where: {
      date: {
        gte: startOfYear,
        lte: endOfYear
      }
    },
    select: {
      amount: true,
      date: true
    }
  })

  const outcomesForYear = await db.outcome.findMany({
    where: {
      date: {
        gte: startOfYear,
        lte: endOfYear
      }
    },
    select: {
      amount: true,
      date: true
    }
  })

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
  const monthlyTrend = MONTH_LABELS.map((label, index) => {
    const monthIncomes = incomesForYear.filter(item => item.date.getMonth() === index)
    const sumIncome = monthIncomes.reduce((acc, curr) => acc + Number(curr.amount), 0)

    const monthOutcomes = outcomesForYear.filter(item => item.date.getMonth() === index)
    const sumOutcome = monthOutcomes.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return {
      label,
      income: sumIncome,
      expense: sumOutcome
    }
  })

  // 6. Ambil rincian data transaksi untuk log transaksi lengkap
  const incomesList = await db.income.findMany({
    orderBy: { date: 'desc' }
  })

  const outcomesList = await db.outcome.findMany({
    orderBy: { date: 'desc' }
  })

  const serializedIncomes = incomesList.map(item => ({
    id: item.id,
    donorName: item.donorName,
    donorAddress: item.donorAddress || '',
    amount: Number(item.amount),
    date: item.date.toISOString(),
    description: item.description || '',
    type: item.type,
    receiptUrls: item.receiptUrls || []
  }))

  const serializedOutcomes = outcomesList.map(item => ({
    id: item.id,
    buyer: item.buyer,
    amount: Number(item.amount),
    date: item.date.toISOString(),
    description: item.description || '',
    category: item.category,
    receiptUrls: item.receiptUrls || []
  }))

  return (
    <LaporanPublicClient
      totalCash={totalCash}
      totalTransfer={totalTransfer}
      totalExpense={totalExpense}
      expenseCategories={expenseCategories}
      transferChannels={transferChannels}
      monthlyTrend={monthlyTrend}
      incomes={serializedIncomes}
      outcomes={serializedOutcomes}
    />
  )
}
