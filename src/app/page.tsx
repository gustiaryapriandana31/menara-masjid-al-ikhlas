import Link from "next/link";
import {Metadata} from "next";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";

export const metadata: Metadata = {
  title: "Report Dana Apps",
  description: "Sistem Pencatatan & Pengelolaan Keuangan Pembangunan Menara Masjid Al-Ikhlas",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-1/2 shadow-sm shadow-orange-200 p-4 rounded-3xl flex flex-col items-center justify-center">
        <HandCoins className="text-orange-700 size-24" />
        <h1 className="my-2 text-xl text-center font-semibold text-yellow-400">
          Sistem Pengelolaan Keuangan Pembangunan Menara Masjid Al-Ikhlas
        </h1>
        <p className="mb-3 text-center text-muted-foreground">
          Transparansi diutamakan, Menara Masjid Al-Ikhlas Sebagai Alat Syiar itu Kita Wujudkan
        </p>
        <Link href="/dashboard">
          <Button className="text-xl p-5">Mari Berdonasi</Button>
        </Link>
      </div>
    </main>
  );
}
