"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  HelpCircle,
  Info,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = "http://localhost:8000";

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const logoutZustand = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      logoutZustand();
      router.push("/login");
    }
  };

  if (!isClient) return null;

  const roleName = user?.roles?.[0]?.name || "";
  const formattedRole = roleName
    ? roleName.charAt(0).toUpperCase() + roleName.slice(1)
    : "";

  return (
    <>
      <div className="flex items-center justify-center px-6 pt-10 pb-4 bg-slate-50 text-emerald-900 z-10 sticky top-0">
        <h1 className="text-lg font-bold tracking-wide">Profil Saya</h1>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
        {isAuthenticated ? (
          <div className="bg-white p-6 rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100 mb-6 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-emerald-50 rounded-t-[30px]"></div>

            <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-4 border-4 border-white shadow-md relative z-10">
              <User size={48} strokeWidth={1.5} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 relative z-10">
              {user?.name}
            </h2>
            <p className="text-[15px] text-gray-500 font-medium mt-1 relative z-10">
              {user?.email}
            </p>

            <div className="mt-3 px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full relative z-10">
              Role: {formattedRole}
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-2xl transition-colors border border-rose-100">
              <LogOut size={20} />
              {isLoggingOut ? "KELUAR..." : "KELUAR"}
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 border-4 border-white shadow-sm">
              <User size={48} strokeWidth={1.5} />
            </div>

            <h2 className="text-xl font-bold text-gray-800">Pengguna Tamu</h2>
            <p className="text-sm text-gray-500 mt-2 px-4 leading-relaxed">
              Silakan masuk ke akun Anda untuk mulai mencatat dan mengelola data
              peternakan.
            </p>

            <div className="flex gap-3 mt-6 w-full">
              <Link
                href="/login"
                className="flex-1 bg-[#6db6a5] hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition-colors flex justify-center items-center">
                MASUK
              </Link>
              <Link
                href="/register"
                className="flex-1 bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 font-semibold py-3.5 rounded-2xl transition-colors flex justify-center items-center">
                DAFTAR
              </Link>
            </div>
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-500 mb-3 ml-2 mt-4">
          Pengaturan & Bantuan
        </h3>
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-600">
                <Settings size={20} />
              </div>
              <span className="text-[15px] font-medium text-gray-800">
                Pengaturan Aplikasi
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-600">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[15px] font-medium text-gray-800">
                Kebijakan Privasi
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-600">
                <HelpCircle size={20} />
              </div>
              <span className="text-[15px] font-medium text-gray-800">
                Pusat Bantuan
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-600">
                <Info size={20} />
              </div>
              <span className="text-[15px] font-medium text-gray-800">
                Tentang Aplikasi
              </span>
            </div>
            <span className="text-xs font-medium text-gray-400 mr-1">
              v1.0.0
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
