import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <>
      <div className="relative w-full h-[220px] rounded-b-[40px] overflow-hidden bg-emerald-50 shrink-0 shadow-sm">
        <Image
          src="/banner.png"
          alt="Ilustrasi Peternakan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/20 z-10"></div>

        <div className="absolute top-0 w-full flex items-center justify-between px-6 pt-10 z-20 text-emerald-900 drop-shadow-sm">
          <Link
            href="/login"
            className="cursor-pointer bg-white/40 p-2 rounded-full backdrop-blur-md">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-wide">Daftar Akun</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 bg-slate-50 overflow-y-auto flex flex-col">
        <div className="mb-4">
          <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
            Nama Lengkap
          </label>
          <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <User size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
            Email
          </label>
          <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Mail size={20} className="text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Masukkan email"
              className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
            Kata Sandi
          </label>
          <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Lock size={20} className="text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Buat kata sandi"
              className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
            Ulangi Kata Sandi
          </label>
          <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Lock size={20} className="text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Ulangi kata sandi"
              className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <button className="w-full bg-[#6db6a5] hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-colors tracking-wide text-[15px]">
          DAFTAR
        </button>

        <div className="mt-8 text-center text-[14px] text-gray-500 flex items-center justify-center gap-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span>
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-emerald-700 font-bold hover:underline">
              Masuk
            </Link>
          </span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
      </div>
    </>
  );
}
