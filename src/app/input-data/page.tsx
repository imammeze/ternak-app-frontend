import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Milk,
  Stethoscope,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import BottomNavigation from "@/shared/components/BottomNavigation";

export default function InputDataPage() {
  const menuItems = [
    {
      id: 1,
      title: "Input Ternak",
      desc: "Tambah atau perbarui data ternak",
      icon: FilePlus2,
      href: "/input-data/ternak",
    },
    {
      id: 2,
      title: "Input Produksi Susu",
      desc: "Catat hasil produksi susu harian",
      icon: Milk,
      href: "/input-data/susu",
    },
    {
      id: 3,
      title: "Input Perawatan Ternak",
      desc: "Catat perawatan kesehatan ternak",
      icon: Stethoscope,
      href: "/input-data/perawatan",
    },
    {
      id: 4,
      title: "Input Pengeluaran Susu",
      desc: "Input pengeluaran susu & biaya pro...",
      icon: Wallet,
      href: "/input-data/pengeluaran",
    },
    {
      id: 5,
      title: "Input Perpindahan Ternak",
      desc: "Catat perpindahan ternak dari kandang",
      icon: ArrowLeftRight,
      href: "/input-data/perpindahan",
    },
  ];

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center font-sans">
      <div className="w-full max-w-[400px] bg-slate-50 min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
        <div className="relative w-full h-[220px]">
          <Image
            src="/banner.png"
            alt="Latar Belakang Peternakan"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-transparent z-10"></div>

          <div className="relative z-20 pt-10 px-6 flex items-center justify-between text-white drop-shadow-sm">
            <Link
              href="/"
              className="cursor-pointer bg-white/50 p-2 rounded-full backdrop-blur-sm">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold">Input Data</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex-1 px-5 -mt-8 z-30 pb-28 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="bg-white rounded-[24px] p-4 flex items-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 hover:border-emerald-200 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mr-4 group-hover:bg-emerald-100 transition-colors">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h2 className="text-gray-800 font-semibold text-[15px]">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-[12px] mt-0.5 truncate">
                      {item.desc}
                    </p>
                  </div>

                  <div className="text-gray-300 group-hover:text-emerald-500 transition-colors ml-2">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
