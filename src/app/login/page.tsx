"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

axios.defaults.withXSRFToken = true;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginZustand = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.get("/sanctum/csrf-cookie");

      const response = await axios.post("/api/login", {
        email: email,
        password: password,
      });

      loginZustand(response.data.user);
      router.push("/");
    } catch (error: any) {
      console.error("Login Gagal:", error);
      if (error.response && error.response.status === 422) {
        setErrorMessage(
          error.response.data.message || "Email atau kata sandi salah.",
        );
      } else {
        setErrorMessage(
          "Terjadi kesalahan pada server. Pastikan backend menyala.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full h-[260px] rounded-b-[40px] overflow-hidden bg-emerald-50 shrink-0 shadow-sm">
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
            href="/"
            className="cursor-pointer bg-white/40 p-2 rounded-full backdrop-blur-md">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-wide">Masuk</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 bg-slate-50 overflow-y-auto flex flex-col">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-[14px] font-medium rounded-2xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col flex-1">
          <div className="mb-5">
            <label className="flex items-center gap-2 text-[15px] font-semibold text-emerald-800 mb-2 ml-1">
              <Mail size={18} /> Email
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-4 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
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

          <div className="mb-3">
            <label className="flex items-center gap-2 text-[15px] font-semibold text-emerald-800 mb-2 ml-1">
              <Lock size={18} /> Kata Sandi
            </label>
            <div className="flex items-center border border-gray-200 rounded-2xl p-4 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi"
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

          <div className="text-right mb-8">
            <Link
              href="#"
              className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-colors tracking-wide text-[15px] ${
              loading
                ? "bg-emerald-400 cursor-not-allowed shadow-none"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"
            }`}>
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>

          <div className="mt-8 text-center text-[14px] text-gray-500 flex items-center justify-center gap-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span>
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-emerald-700 font-bold hover:underline">
                Daftar
              </Link>
            </span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </form>
      </div>
    </>
  );
}
