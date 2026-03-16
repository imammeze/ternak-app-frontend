import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  return (
    <div className="relative w-full h-[320px] overflow-hidden">
      <Image
        src="/banner.png"
        alt="Latar Belakang Peternakan"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-transparent z-10"></div>

      <div className="relative z-20 pt-10 px-6 h-full flex flex-col justify-between pb-24">
        <div className="flex items-center justify-between text-white drop-shadow-md">
          <ChevronLeft size={24} className="cursor-pointer" />
          <div className="text-center">
            <h1 className="text-xl font-bold">Halo, Admin</h1>
            <p className="text-xs opacity-90 font-medium">
              Sistem Manajemen Peternakan
            </p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>
    </div>
  );
}
