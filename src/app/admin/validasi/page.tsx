import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Validasi Donasi - Dinonaktifkan Sementara",
  description: "Fitur validasi donasi sementara dinonaktifkan."
}

export default async function ValidasiPage() {
  // Fitur validasi donasi sementara dinonaktifkan
  redirect("/admin/laporan-keuangan")
}
