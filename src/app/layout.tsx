import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ServiceWorkerRegister from "@/components/shared/sw-register";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const merriweather = Merriweather({subsets:['latin'],variable:'--font-serif'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://menara-masjid-al-ikhlas.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Menara Masjid Al-Ikhlas – Donasi & Transparansi Keuangan",
    template: "%s | Menara Masjid Al-Ikhlas",
  },
  description:
    "Donasi pembangunan Menara Masjid Al-Ikhlas secara online. Lihat laporan keuangan transparan, konfirmasi transfer, dan perkembangan pembangunan masjid secara real-time.",
  keywords: [
    "donasi masjid",
    "menara masjid al ikhlas",
    "masjid al ikhlas",
    "donasi pembangunan masjid",
    "wakaf masjid",
    "transparansi keuangan masjid",
    "konfirmasi donasi masjid",
    "laporan keuangan masjid",
    "sedekah jariyah masjid",
    "pembangunan menara masjid",
    "donasi online masjid",
    "infak masjid al ikhlas",
  ],
  authors: [{ name: "Panitia Pembangunan Menara Masjid Al-Ikhlas" }],
  creator: "Panitia Pembangunan Menara Masjid Al-Ikhlas",
  publisher: "Masjid Al-Ikhlas",
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Menara Masjid Al-Ikhlas",
    title: "Donasi Pembangunan Menara Masjid Al-Ikhlas",
    description:
      "Wujudkan pahala jariyah Anda. Donasikan untuk pembangunan Menara Masjid Al-Ikhlas dan pantau transparansi keuangan secara real-time.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Menara Masjid Al-Ikhlas – Donasi & Transparansi Keuangan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donasi Pembangunan Menara Masjid Al-Ikhlas",
    description:
      "Donasi untuk pembangunan Menara Masjid Al-Ikhlas. Laporan keuangan transparan & konfirmasi donasi online.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
  verification: {
    google: "sII3oERrXd3zPHTYSeJbgFFxYgbtDAJzBBBw3DbPSeg",
  },
};

import { MoneyAnimationProvider } from "@/components/shared/money-animation-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, merriweather.variable, "font-sans", notoSans.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <MoneyAnimationProvider>
          {children}
        </MoneyAnimationProvider>
      </body>
    </html>
  );
}
