import { MetadataRoute } from 'next'

const BASE_URL = 'https://menara-masjid-al-ikhlas.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/donasi', '/laporan-keuangan'],
        disallow: ['/admin/', '/login', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
