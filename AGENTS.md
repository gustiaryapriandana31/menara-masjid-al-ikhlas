<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🕌 Manara Masjid Al-Ikhlas - Sistem Pencatatan Keuangan

Dokumen ini berisi spesifikasi kebutuhan, arsitektur, dan panduan kolaborasi untuk pengembangan Sistem Pencatatan Keuangan Pembangunan Menara Masjid Al-Ikhlas. Dokumen ini dirancang sebagai acuan bersama antara User dan Agent (AI).

---

## 📋 Deskripsi Proyek
Sistem ini bertujuan untuk mencatat semua transaksi pemasukan dan pengeluaran dana pembangunan menara Masjid Al-Ikhlas secara transparan, akurat, dan dapat dipertanggungjawabkan kepada publik (donatur) serta memudahkan panitia pembangunan dalam manajemen dana.

---

## 🛠️ Tech Stack & Konfigurasi
Aplikasi ini dibangun menggunakan teknologi modern untuk menjamin performa, keamanan, dan keindahan UI:
- **Framework**: Next.js 16.2.6 (App Router)
- **Library UI**: React 19, Shadcn UI
- **Styling**: Tailwind CSS v4 & Vanilla CSS (Desain Premium & Responsive)
- **Database & Auth**: Supabase (Database PostgreSQL, Auth Panitia, dan Storage untuk Bukti Transfer)
- **ORM**: Prisma ORM (untuk pengelolaan database schema dan query type-safe)

---

## ⚙️ Fitur Utama & Kebutuhan Fungsional

### 1. Pencatatan Keuangan Manual (Sisi Panitia/Admin)
*   **Pencatatan Pemasukan (Cash/Offline)**: Form untuk menginput pemasukan yang diterima langsung secara tunai/luring.
    *   *Data yang dicatat*: Nama Donatur (bisa Hamba Allah), Nominal, Tanggal Terima, Keterangan/Catatan.
*   **Pencatatan Pengeluaran**: Form untuk menginput pengeluaran untuk kebutuhan pembangunan (material, upah tukang, konsumsi, dll).
    *   *Data yang dicatat*: Nama Item/Kebutuhan, Kategori Pengeluaran (Material, Tenaga Kerja, Operasional, Lainnya), Nominal, Tanggal Pengeluaran, Bukti Nota/Kuitansi (Upload Gambar ke Supabase Storage), Keterangan.

### 2. Konfirmasi Donasi Online (Sisi Donatur/Publik)
*   Halaman publik bagi donatur yang sudah melakukan transfer rekening bank atau scan QRIS untuk melakukan konfirmasi agar donasi mereka tercatat.
*   **Form Konfirmasi Donasi**:
    *   *Nama Donatur*: Input teks bebas, atau opsi checkbox "Sembunyikan nama (Hamba Allah)".
    *   *Nominal Donasi*: Angka nominal transfer.
    *   *Tanggal Transfer*: Datepicker tanggal transfer dilakukan.
    *   *Saluran Pembayaran*: Pilihan Bank Transfer / QRIS / Lainnya.
    *   *Bukti Transfer*: Upload file gambar bukti transfer (foto/screenshot).
*   **Status Konfirmasi**: Data awal masuk dengan status `PENDING` (belum memengaruhi saldo utama sebelum divalidasi oleh panitia).

### 3. Dashboard Validasi Panitia (Sisi Admin)
*   Halaman khusus panitia untuk memverifikasi donasi online yang masuk.
*   **Daftar Menunggu Validasi (Pending)**: Menampilkan list konfirmasi donasi online yang statusnya masih `PENDING` lengkap dengan file bukti transfer.
*   **Aksi Validasi**:
    *   **Setujui (Approve)**: Status berubah menjadi `APPROVED`. Sistem secara otomatis membuat entri baru di tabel Transaksi Utama sebagai pemasukan, memperbarui saldo total pembangunan, dan mengirim data ke log publik.
    *   **Tolak (Reject)**: Status berubah menjadi `REJECTED`. Panitia dapat menambahkan alasan penolakan (misal: "Bukti transfer tidak jelas/tidak terbaca", "Nominal tidak sesuai dengan mutasi").

### 4. Dashboard Laporan & Transparansi (Sisi Publik & Panitia)
*   **Ringkasan Keuangan (KPI Cards)**:
    *   Total Saldo Saat Ini (Total Pemasukan - Total Pengeluaran)
    *   Total Pemasukan (Offline + Online yang disetujui)
    *   Total Pengeluaran
    *   Persentase Progress Pembangunan / Target Dana (opsional)
*   **Grafik Keuangan (Charts)**:
    *   Grafik tren pemasukan & pengeluaran bulanan/mingguan.
    *   Diagram lingkaran (Pie Chart) alokasi pengeluaran berdasarkan kategori (misal: Material 60%, Tenaga Kerja 30%, dll).
*   **Log Transaksi Lengkap**:
    *   Tabel interaktif yang menampilkan daftar semua transaksi (Pemasukan & Pengeluaran) berurutan dari yang terbaru.
    *   Fitur filter berdasarkan tipe transaksi (Pemasukan/Pengeluaran), kategori, tanggal, serta kolom pencarian nama donatur atau keterangan.
    *   Penanda khusus untuk transaksi pemasukan yang berasal dari validasi donasi online (transparansi digital).

---

## 🗄️ Rencana Skema Database (Prisma Schema)

Secara garis besar, berikut adalah rancangan model database yang akan kita buat:

```prisma
// Enum untuk Tipe Transaksi
enum TransactionType {
  INCOME
  EXPENSE
}

// Enum untuk Status Donasi Online
enum DonationStatus {
  PENDING
  APPROVED
  REJECTED
}

// Enum untuk Kategori Pengeluaran
enum ExpenseCategory {
  MATERIAL
  LABOR        // Upah Tukang
  OPERATIONAL  // Konsumsi, Transport, dll
  OTHER
}

// Model Transaksi Utama (Menentukan Saldo Kas Riil)
model Transaction {
  id                    String                @id @default(uuid())
  type                  TransactionType
  amount                Decimal               @db.Decimal(12, 2)
  date                  DateTime
  description           String
  category              ExpenseCategory?      // Hanya terisi jika type == EXPENSE
  receiptUrl            String?               // Foto kuitansi / nota pengeluaran
  createdAt             DateTime              @default(now())
  updatedAt             DateTime              @updatedAt
  
  // Relasi jika pemasukan berasal dari Donasi Online
  donationConfirmationId String?              @unique
  donationConfirmation   DonationConfirmation? @relation(fields: [donationConfirmationId], references: [id])
}

// Model Konfirmasi Donasi Online oleh Donatur
model DonationConfirmation {
  id              String         @id @default(uuid())
  donorName       String         // Bisa "Hamba Allah"
  isAnonymous     Boolean        @default(false)
  amount          Decimal        @db.Decimal(12, 2)
  transferDate    DateTime
  paymentChannel  String         // misal: "BSI", "Mandiri", "QRIS"
  proofUrl        String         // Url gambar bukti transfer di Supabase Storage
  status          DonationStatus @default(PENDING)
  rejectionReason String?        // Catatan dari panitia jika ditolak
  validatedAt     DateTime?
  validatedBy     String?        // ID Panitia yang melakukan validasi
  createdAt       DateTime       @default(now())
  
  // Relasi balik ke Transaksi Utama jika di-approve
  transaction     Transaction?
}

// Model User (Untuk Login Panitia / Admin)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   @default("COMMITTEE") // "ADMIN", "COMMITTEE"
  createdAt DateTime @default(now())
}
```

---

## 📂 Rencana Struktur Folder Aplikasi
```text
src/
├── app/
│   ├── layout.tsx         # Layout utama (navbar publik, styling dasar)
│   ├── page.tsx           # Landing page & dashboard transparansi publik
│   ├── donasi/
│   │   └── page.tsx       # Halaman form konfirmasi donasi donatur
│   ├── login/
│   │   └── page.tsx       # Halaman login panitia
│   ├── admin/
│   │   ├── layout.tsx     # Sidebar khusus navigasi admin/panitia
│   │   ├── dashboard/
│   │   │   └── page.tsx   # Dashboard internal & statistik panitia
│   │   ├── validasi/
│   │   │   └── page.tsx   # Manajemen verifikasi donasi pending
│   │   └── transaksi/
│   │       └── page.tsx   # Form input transaksi manual (pemasukan/pengeluaran)
│   └── globals.css        # Konfigurasi Tailwind & Global CSS
├── components/
│   ├── ui/                # Component dari Shadcn UI (Button, Card, Input, Dialog, dll)
│   ├── shared/            # Komponen pakai ulang (Navbar, Sidebar, Footer)
│   └── dashboard/         # Komponen spesifik dashboard (Charts, TransactionTable)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── db.ts              # Inisialisasi Prisma Client
│   └── supabase.ts        # Inisialisasi Supabase Client (untuk Storage upload)
└── types/                 # Definisi type TypeScript
```

---

## 🤝 Panduan Interaksi & Pengembangan (Untuk Agent AI)

1.  **Validasi Next.js 16**: Selalu perhatikan aturan Next.js 16.2.x yang berada di header file ini sebelum memodifikasi kode app router. Perhatikan petunjuk deprecation atau perbedaan API (seperti instant navigation dan metadata).
2.  **Desain Premium & Responsive**: UI harus terlihat bersih, modern, dan bernuansa Islami yang tenang (penggunaan warna hijau daun yang teduh, putih bersih, abu-abu terang, dan aksen emas/emerald). Pastikan ramah perangkat mobile (karena donatur sering mengakses lewat HP untuk konfirmasi donasi).
3.  **Keamanan & Validasi**:
    *   Validasi input sisi server (Zod) untuk form donasi dan transaksi.
    *   Form donasi online wajib divalidasi gambar bukti transfernya agar tidak ada inputan palsu (SQL injection atau spam) masuk ke kas.
4.  **Alur Kerja Bertahap**:
    *   **Fase 1**: Penataan UI & Dashboard Transparansi Publik (menggunakan Mock Data dahulu).
    *   **Fase 2**: Integrasi Database dengan Prisma & Supabase (Setup skema, koneksi client).
    *   **Fase 3**: Implementasi Fitur Konfirmasi Donasi Online (Form input, upload file ke Supabase Storage).
    *   **Fase 4**: Pembuatan Dashboard Validasi & Input Transaksi Manual untuk Panitia (beserta Authentication).
    *   **Fase 5**: Finalisasi, testing menyeluruh, dan optimasi performa.
