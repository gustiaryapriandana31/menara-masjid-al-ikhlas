import { Metadata } from 'next'
import { DonationPageJsonLd } from '@/components/shared/json-ld'
import KonfirmasiDonasiPage from './donasi-client'

export const metadata: Metadata = {
  title: 'Konfirmasi Donasi – Menara Masjid Al-Ikhlas',
  description:
    'Konfirmasi donasi pembangunan Menara Masjid Al-Ikhlas. Laporkan transfer bank atau QRIS Anda agar tercatat dan divalidasi oleh panitia.',
  keywords: [
    'konfirmasi donasi masjid',
    'donasi masjid al ikhlas',
    'transfer donasi masjid',
    'QRIS masjid',
    'donasi pembangunan menara masjid',
    'sedekah jariyah masjid al ikhlas',
  ],
  alternates: {
    canonical: 'https://menara-masjid-al-ikhlas.vercel.app/donasi',
  },
  openGraph: {
    title: 'Konfirmasi Donasi – Menara Masjid Al-Ikhlas',
    description:
      'Konfirmasi transfer bank atau QRIS untuk donasi pembangunan Menara Masjid Al-Ikhlas. Amanah, transparan, real-time.',
    url: 'https://menara-masjid-al-ikhlas.vercel.app/donasi',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function DonasiPage() {
  return (
    <>
      <DonationPageJsonLd />
      <KonfirmasiDonasiPage />
    </>
  )
}
