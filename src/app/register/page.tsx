"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = "http://localhost:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginZustand = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== passwordConfirmation) {
      setErrorMessage("Kata sandi dan Ulangi Kata sandi tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/register", {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      console.log("Register Sukses:", response.data);
      loginZustand(response.data.user);

      router.push("/");
    } catch (error: any) {
      console.error("Register Gagal:", error);
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setErrorMessage(firstError[0] || "Pastikan data yang diisi benar.");
      } else {
        setErrorMessage("Terjadi kesalahan pada server. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-[14px] font-medium rounded-2xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col flex-1">
          <div className="mb-4">
            <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
              Nama Lengkap
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
              <User size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap"
                className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
              Email
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
              <Mail size={20} className="text-gray-400 mr-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Masukkan email"
                className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
              Kata Sandi
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Buat kata sandi"
                className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 ml-2 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[14px] font-semibold text-emerald-900 mb-2 ml-1">
              Ulangi Kata Sandi
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                placeholder="Ulangi kata sandi"
                className="flex-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 ml-2 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-colors tracking-wide text-[15px] ${
              loading
                ? "bg-emerald-400 cursor-not-allowed shadow-none"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"
            }`}>
            {loading ? "MEMPROSES..." : "DAFTAR"}
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
        </form>
      </div>
    </>
  );
}
