"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Clock,
  TimerOff,
  AlignJustify,
} from "lucide-react";

export default function AbsenPage() {
  const menuAbsensi = [
    {
      title: "Presensi Masuk",
      icon: LogIn,
      iconColor: "text-emerald-500",
      href: "/absen/masuk",
    },
    {
      title: "Presensi Keluar",
      icon: LogOut,
      iconColor: "text-rose-400",
      href: "/absen/keluar",
    },
    {
      title: "Mulai Menginap",
      icon: Clock,
      iconColor: "text-emerald-500",
      href: "/absen/mulai-lembur",
    },
    {
      title: "Selesai Menginap",
      icon: TimerOff,
      iconColor: "text-amber-500",
      href: "/absen/selesai-lembur",
    },
    {
      title: "Histori Absensi",
      icon: AlignJustify,
      iconColor: "text-slate-400",
      href: "/absen/histori",
    },
  ];

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/" className="p-2 cursor-pointer transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold ml-2 tracking-wide">Kehadiran</h1>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {menuAbsensi.map((menu, index) => {
            const IconComponent = menu.icon;

            return (
              <Link
                key={index}
                href={menu.href}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 hover:border-emerald-200 transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <IconComponent size={24} className={menu.iconColor} />
                  <span className="text-[15px] font-medium text-gray-700">
                    {menu.title}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
