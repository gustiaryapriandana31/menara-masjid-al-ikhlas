/**
 * JSON-LD Structured Data Component
 * Membantu Google dan AI (Gemini, Bing Copilot, dll) memahami
 * konteks halaman ini adalah tentang donasi pembangunan masjid.
 */

const BASE_URL = 'https://menara-masjid-al-ikhlas.vercel.app'

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ReligiousOrganization',
    name: 'Masjid Al-Ikhlas',
    alternateName: 'Menara Masjid Al-Ikhlas',
    description:
      'Masjid Al-Ikhlas sedang melaksanakan program pembangunan menara masjid. Donasi terbuka untuk umum melalui transfer bank dan QRIS.',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.jpg`,
    image: `${BASE_URL}/masjid.jpg`,
    knowsAbout: [
      'Pembangunan Menara Masjid',
      'Donasi Masjid',
      'Donasi Menara Masjid',
      'Transparansi Keuangan Masjid',
      'Wakaf Jariyah',
      'Masjid Al-Ikhlas Meranjat II',
      'Meranjat 2',
      'Meranjat II',
      'DKM Al-Ikhlas',
      'Ngopi Besan',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: 'Indonesia',
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function DonationPageJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Konfirmasi Donasi – Menara Masjid Al-Ikhlas',
    description:
      'Halaman konfirmasi donasi pembangunan Menara Masjid Al-Ikhlas. Donatur dapat mengkonfirmasi transfer bank atau QRIS di sini.',
    url: `${BASE_URL}/donasi`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Menara Masjid Al-Ikhlas',
      url: BASE_URL,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Konfirmasi Donasi', item: `${BASE_URL}/donasi` },
      ],
    },
    mainEntity: {
      '@type': 'DonateAction',
      name: 'Donasi Pembangunan Menara Masjid Al-Ikhlas',
      description:
        'Donasikan dana Anda untuk mendukung pembangunan Menara Masjid Al-Ikhlas. Laporan keuangan transparan tersedia untuk publik.',
      recipient: {
        '@type': 'ReligiousOrganization',
        name: 'Masjid Al-Ikhlas',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function LaporanPageJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Laporan Keuangan – Menara Masjid Al-Ikhlas',
    description:
      'Laporan keuangan transparan pembangunan Menara Masjid Al-Ikhlas. Lihat saldo kas, riwayat donasi, dan alokasi pengeluaran secara real-time.',
    url: `${BASE_URL}/laporan-keuangan`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Menara Masjid Al-Ikhlas',
      url: BASE_URL,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Laporan Keuangan', item: `${BASE_URL}/laporan-keuangan` },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function HomePageJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Menara Masjid Al-Ikhlas',
    alternateName: [
      'Donasi Masjid Al-Ikhlas',
      'Transparansi Keuangan Menara Masjid Al-Ikhlas',
    ],
    description:
      'Platform donasi dan transparansi keuangan pembangunan Menara Masjid Al-Ikhlas. Donasi online via transfer bank & QRIS, laporan real-time.',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'ReligiousOrganization',
      name: 'Masjid Al-Ikhlas',
      url: BASE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
