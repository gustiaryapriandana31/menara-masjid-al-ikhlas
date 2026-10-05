/**
 * Helper untuk mengubah angka menjadi kata terbilang dalam Bahasa Indonesia
 */
export function terbilang(nilai: number): string {
  const bilangan = [
    "", "satu", "dua", "tiga", "empat", "lima",
    "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
  ]

  const temp = Math.floor(nilai)
  let hasil = ""

  if (temp < 12) {
    hasil = bilangan[temp]
  } else if (temp < 20) {
    hasil = terbilang(temp - 10) + " belas"
  } else if (temp < 100) {
    hasil = terbilang(Math.floor(temp / 10)) + " puluh " + terbilang(temp % 10)
  } else if (temp < 200) {
    hasil = "seratus " + terbilang(temp - 100)
  } else if (temp < 1000) {
    hasil = terbilang(Math.floor(temp / 100)) + " ratus " + terbilang(temp % 100)
  } else if (temp < 2000) {
    hasil = "seribu " + terbilang(temp - 1000)
  } else if (temp < 1000000) {
    hasil = terbilang(Math.floor(temp / 1000)) + " ribu " + terbilang(temp % 1000)
  } else if (temp < 1000000000) {
    hasil = terbilang(Math.floor(temp / 1000000)) + " juta " + terbilang(temp % 1000000)
  } else if (temp < 1000000000000) {
    hasil = terbilang(Math.floor(temp / 1000000000)) + " miliar " + terbilang(temp % 1000000000)
  } else if (temp < 1000000000000000) {
    hasil = terbilang(Math.floor(temp / 1000000000000)) + " triliun " + terbilang(temp % 1000000000000)
  }

  return hasil.replace(/\s+/g, " ").trim()
}

/**
 * Format nominal angka ke kalimat terbilang rupiah (contoh: 5000000 -> "Lima juta rupiah")
 */
export function formatTerbilang(amount: number): string {
  if (amount === 0) return "nol rupiah"
  const kata = terbilang(amount)
  return kata.charAt(0).toUpperCase() + kata.slice(1) + " rupiah"
}

/**
 * Format angka ke format ribuan rupiah (contoh: 500000 -> "500.000")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}

/**
 * Agregasi array string kuantitas material (contoh: ["20 sak", "30 sak"] -> "50 Sak")
 */
export function aggregateQuantities(quantities: string[]): string {
  if (!quantities || quantities.length === 0) return "-"

  const unitTotals = new Map<string, number>()
  const textItems: string[] = []

  quantities.forEach(qStr => {
    const trimmed = qStr.trim()
    if (!trimmed) return

    // Match number + unit (e.g., "30 sak", "1.5 truk", "1000 pcs")
    const match = trimmed.match(/^([\d.,]+)\s*(.*)$/)
    if (match) {
      const numStr = match[1].replace(/\./g, "").replace(",", ".")
      const num = parseFloat(numStr)
      const unit = match[2] ? match[2].trim().toLowerCase() : ""

      if (!isNaN(num) && num > 0) {
        const unitKey = unit || "unit"
        unitTotals.set(unitKey, (unitTotals.get(unitKey) || 0) + num)
      } else {
        textItems.push(trimmed)
      }
    } else {
      textItems.push(trimmed)
    }
  })

  const results: string[] = []
  unitTotals.forEach((totalNum, unit) => {
    const formattedNum = new Intl.NumberFormat("id-ID").format(totalNum)
    const formattedUnit = unit === "unit" ? "" : ` ${unit.charAt(0).toUpperCase() + unit.slice(1)}`
    results.push(`${formattedNum}${formattedUnit}`)
  })

  textItems.forEach(item => {
    if (!results.includes(item)) {
      results.push(item)
    }
  })

  return results.length > 0 ? results.join(", ") : quantities.join(", ")
}

