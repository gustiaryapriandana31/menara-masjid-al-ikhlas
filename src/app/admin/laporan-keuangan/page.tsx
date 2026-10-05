import db from '@/lib/db'
import LaporanClient from './laporan-client'
import { safeDateToIso } from '@/lib/utils'
import { aggregateQuantities } from '@/lib/format'

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
    const monthIncomes = incomesForYear.filter(item => item.date?.getMonth() === index)
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

  // 6. Donatur & Transaksi Eager Loading (Pemasukan Uang, Konfirmasi Online, & Donasi Material)
  const [incomeDonors, confirmationDonors, materialDonors, rawMaterials] = await Promise.all([
    db.income.findMany({
      select: {
        donorName: true,
        donorAddress: true,
        donorPhone: true
      }
    }),
    db.donationConfirmation.findMany({
      where: { status: 'APPROVED' },
      select: {
        donorName: true,
        donorAddress: true,
        donorPhone: true,
        isAnonymous: true
      }
    }),
    db.materialDonation.findMany({
      select: {
        donorName: true,
        materialName: true,
        quantity: true
      }
    }),
    db.materialDonation.findMany({
      orderBy: { date: 'desc' },
      select: {
        id: true,
        donorName: true,
        materialName: true,
        quantity: true,
        date: true,
        createdAt: true,
        description: true
      }
    })
  ])

  // Map Donatur Terpadu (Menentukan jenis donasi: "Uang", "Barang", atau "Uang & Barang")
  interface UnifiedDonor {
    donorName: string
    donorAddress: string
    donorPhone: string
    hasMoney: boolean
    hasMaterial: boolean
  }

  const donorMap = new Map<string, UnifiedDonor>()

  // A. Pemasukan Kas Uang (Income)
  incomeDonors.forEach(item => {
    const isHambaAllah = item.donorName.trim().toLowerCase() === "hamba allah"
    const key = isHambaAllah ? "hamba_allah" : `${item.donorName.trim().toLowerCase()}_${(item.donorPhone || '').trim()}`
    
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        donorName: isHambaAllah ? "Hamba Allah" : item.donorName,
        donorAddress: isHambaAllah ? "" : (item.donorAddress || ""),
        donorPhone: isHambaAllah ? "" : (item.donorPhone || ""),
        hasMoney: true,
        hasMaterial: false
      })
    } else {
      const existing = donorMap.get(key)!
      existing.hasMoney = true
      if (!isHambaAllah && !existing.donorAddress && item.donorAddress) {
        existing.donorAddress = item.donorAddress
      }
    }
  })

  // B. Konfirmasi Donasi Online (DonationConfirmation)
  confirmationDonors.forEach(item => {
    const finalName = item.isAnonymous ? "Hamba Allah" : item.donorName
    const isHambaAllah = finalName.trim().toLowerCase() === "hamba allah"
    const key = isHambaAllah ? "hamba_allah" : `${finalName.trim().toLowerCase()}_${(item.donorPhone || '').trim()}`
    
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        donorName: isHambaAllah ? "Hamba Allah" : finalName,
        donorAddress: isHambaAllah ? "" : (item.donorAddress || ""),
        donorPhone: isHambaAllah ? "" : (item.donorPhone || ""),
        hasMoney: true,
        hasMaterial: false
      })
    } else {
      const existing = donorMap.get(key)!
      existing.hasMoney = true
      if (!isHambaAllah && !existing.donorAddress && item.donorAddress) {
        existing.donorAddress = item.donorAddress
      }
    }
  })

  // C. Donasi Material (MaterialDonation)
  materialDonors.forEach(item => {
    const isHambaAllah = item.donorName.trim().toLowerCase() === "hamba allah"
    const key = isHambaAllah ? "hamba_allah" : `${item.donorName.trim().toLowerCase()}_`
    
    if (!donorMap.has(key)) {
      donorMap.set(key, {
        donorName: isHambaAllah ? "Hamba Allah" : item.donorName,
        donorAddress: "",
        donorPhone: "",
        hasMoney: false,
        hasMaterial: true
      })
    } else {
      const existing = donorMap.get(key)!
      existing.hasMaterial = true
    }
  })

  const donors = Array.from(donorMap.values()).map((d, index) => {
    let donationType: "MONEY" | "MATERIAL" | "BOTH" = "MONEY"
    if (d.hasMoney && d.hasMaterial) {
      donationType = "BOTH"
    } else if (d.hasMaterial) {
      donationType = "MATERIAL"
    }

    return {
      no: index + 1,
      donorName: d.donorName,
      donorAddress: d.donorAddress,
      donorPhone: d.donorPhone,
      donationType
    }
  })

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
      materialStats={materialStats}
    />
  )
}
