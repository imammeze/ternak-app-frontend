"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Home,
  Info,
  Maximize2,
  Tag,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

interface Kandang {
  id: string;
  kode_kandang: string;
  nama_kandang: string;
  kapasitas: number;
  jenis: string;
  status: string;
  catatan: string;
}

export default function ManajemenKandangPage() {
  const [kandangs, setKandangs] = useState<Kandang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKandang = async () => {
      try {
        const response = await api.get("/api/kandang");
        setKandangs(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil data kandang:", err);
        setError("Gagal memuat daftar kandang.");
      } finally {
        setLoading(false);
      }
    };

    fetchKandang();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Aktif") return "bg-emerald-100 text-emerald-700";
    if (status === "Penuh") return "bg-rose-100 text-rose-700";
    if (status === "Renovasi") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Manajemen Kandang</h1>
        <Link
          href="/manajemen-kandang/tambah"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat daftar kandang...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
            {error}
          </div>
        ) : kandangs.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <Home size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-sm">Belum ada data kandang.</p>
            <p className="text-xs mt-1">Silakan tambahkan kandang baru.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {kandangs.map((kandang) => (
              <div
                key={kandang.id}
                className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden">
                {/* Garis Aksen Kiri */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400"></div>

                <div className="flex justify-between items-start ml-2 mb-3">
                  <div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md tracking-wider">
                      {kandang.kode_kandang}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-1.5 leading-tight">
                      {kandang.nama_kandang}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${getStatusColor(kandang.status)}`}>
                    {kandang.status}
                  </span>
                </div>

                <div className="ml-2 grid grid-cols-2 gap-3 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500">
                      <Maximize2 size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Kapasitas
                      </span>
                      <span className="text-[13px] font-bold text-gray-700">
                        {kandang.kapasitas} Ekor
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-50 p-1.5 rounded-lg text-amber-500">
                      <Tag size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Jenis
                      </span>
                      <span className="text-[13px] font-bold text-gray-700">
                        {kandang.jenis}
                      </span>
                    </div>
                  </div>
                </div>

                {kandang.catatan && (
                  <div className="ml-2 mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-start gap-2">
                    <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-500 font-medium italic leading-relaxed">
                      "{kandang.catatan}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
