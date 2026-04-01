"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

export default function CreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!formData.role) {
      setErrorMsg("Mohon pilih Role / Hak Akses untuk user ini.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setErrorMsg("Password minimal harus 8 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/users", formData);

      toast.success("User baru berhasil ditambahkan!");
      router.push("/user-management");
    } catch (err: any) {
      console.error("Gagal menambah user:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data ke server.",
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/user-management"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Tambah User Baru</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <User size={20} className="text-emerald-600 mr-3" />
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama pengguna..."
                className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <Mail size={20} className="text-emerald-600 mr-3" />
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="nama@email.com"
                className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <Lock size={20} className="text-emerald-600 mr-3" />
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Kata Sandi (Minimal 8 Karakter)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative mt-2">
            <div className="flex items-center gap-3 pointer-events-none z-10">
              <ShieldCheck size={22} className="text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Pilih Role
                </span>
              </div>
            </div>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="appearance-none bg-transparent text-[15px] font-bold text-gray-800 text-right pr-6 outline-none cursor-pointer absolute right-3 inset-y-0 pl-32 z-20">
              <option value="" disabled>
                -- Pilih Hak Akses --
              </option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="stakeholder">Stakeholder</option>
              <option value="karyawan">Karyawan</option>
            </select>
            <ChevronRight
              size={18}
              className="text-gray-400 absolute right-3 pointer-events-none z-10"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-8 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all tracking-wider flex justify-center items-center gap-2 ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200 active:scale-[0.98]"
            }`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "BUAT AKUN USER"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
