import db from '@/lib/db'
import LaporanClient from './laporan-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Laporan Keuangan - Panel Panitia',
  description: 'Statistik kas pembangunan Menara Masjid Al-Ikhlas secara lengkap.'
}

export default async function LaporanKeuanganPage() {
  // ==========================================
  // LOGIC BELAJAR: KONEKSI & AGREGASI DATABASE
  // ==========================================
  
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

  // Petakan hasil kueri database
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

  // 4. Ambil jumlah pengeluaran dikelompokkan (GROUP BY) berdasarkan Kategori Belanja
  const categoryGroup = await db.outcome.groupBy({
    by: ['category'],
    _sum: { amount: true }
  })

  // Inisialisasi default nominal kategori belanja
  let expenseCategories = {
    MATERIAL: 0,
    LABOR: 0,
    OPERATIONAL: 0,
    OTHER: 0
  }

  // Petakan hasil GROUP BY database ke objek kategori
  categoryGroup.forEach(group => {
    if (group.category in expenseCategories) {
      expenseCategories[group.category as keyof typeof expenseCategories] = Number(group._sum.amount || 0)
    }
  })

  // 5. Ambil data bulanan sepanjang tahun berjalan untuk grafik batang (Bar Chart)
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

  // Kelompokkan data transaksi ke dalam 12 Bulan Kalender
  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
  const monthlyTrend = MONTH_LABELS.map((label, index) => {
    // Filter dan jumlahkan pemasukan yang terjadi pada index bulan ini (0-11)
    const monthIncomes = incomesForYear.filter(item => item.date.getMonth() === index)
    const sumIncome = monthIncomes.reduce((acc, curr) => acc + Number(curr.amount), 0)

    // Filter dan jumlahkan pengeluaran yang terjadi pada index bulan ini (0-11)
    const monthOutcomes = outcomesForYear.filter(item => item.date.getMonth() === index)
    const sumOutcome = monthOutcomes.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return {
      label,
      income: sumIncome,
      expense: sumOutcome
    }
  })

  // 6. Ambil data donatur dari Income (pemasukan manual) dan DonationConfirmation (donasi online)
  const [incomeDonors, confirmationDonors] = await Promise.all([
    db.income.findMany({
      select: {
        donorName: true,
        donorAddress: true,
        donorPhone: true
      }
    }),
    db.donationConfirmation.findMany({
      select: {
        donorName: true,
        donorAddress: true,
        donorPhone: true,
        isAnonymous: true
      }
    })
  ])

  // Gabungkan dan filter unik
  const donorMap = new Map<string, { donorName: string; donorAddress: string; donorPhone: string }>()

  // Proses donatur dari income
  incomeDonors.forEach(item => {
    const isHambaAllah = item.donorName.trim().toLowerCase() === "hamba allah"
    const key = isHambaAllah ? "hamba_allah" : `${item.donorName.trim().toLowerCase()}_${(item.donorPhone || '').trim()}`
    
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        donorName: isHambaAllah ? "Hamba Allah" : item.donorName,
        donorAddress: isHambaAllah ? "" : (item.donorAddress || ""),
        donorPhone: isHambaAllah ? "" : (item.donorPhone || "")
      })
    } else {
      const existing = donorMap.get(key)!
      if (!isHambaAllah && !existing.donorAddress && item.donorAddress) {
        existing.donorAddress = item.donorAddress
      }
    }
  })

  // Proses donatur dari konfirmasi online
  confirmationDonors.forEach(item => {
    const finalName = item.isAnonymous ? "Hamba Allah" : item.donorName
    const isHambaAllah = finalName.trim().toLowerCase() === "hamba allah"
    const key = isHambaAllah ? "hamba_allah" : `${finalName.trim().toLowerCase()}_${(item.donorPhone || '').trim()}`
    
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        donorName: isHambaAllah ? "Hamba Allah" : finalName,
        donorAddress: isHambaAllah ? "" : (item.donorAddress || ""),
        donorPhone: isHambaAllah ? "" : (item.donorPhone || "")
      })
    } else {
      const existing = donorMap.get(key)!
      if (!isHambaAllah && !existing.donorAddress && item.donorAddress) {
        existing.donorAddress = item.donorAddress
      }
    }
  })

  const donors = Array.from(donorMap.values()).map((d, index) => ({
    no: index + 1,
    donorName: d.donorName,
    donorAddress: d.donorAddress,
    donorPhone: d.donorPhone
  }))

  // ==========================================
  // PENGIRIMAN DATA KE KOMPONEN CLIENT (VIEW)
  // ==========================================
  return (
    <LaporanClient
      totalCash={totalCash}
      totalTransfer={totalTransfer}
      totalExpense={totalExpense}
      expenseCategories={expenseCategories}
      transferChannels={transferChannels}
      monthlyTrend={monthlyTrend}
      donors={donors}
    />
  )
}
