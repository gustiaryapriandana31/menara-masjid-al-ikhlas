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
