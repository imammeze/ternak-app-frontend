"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Search,
  Info,
  Droplets,
  CalendarDays,
  User,
  Milk,
} from "lucide-react";
import api from "@/lib/axios";

interface ProduksiSusu {
  id: string;
  tanggal: string;
  kepemilikan: string;
  total_liter: string | number;
  petugas: string;
  pemilik?: { name: string };
  pagi_1l: number;
  sore_1l: number;
}

export default function RiwayatSusuPage() {
  const [susuList, setSusuList] = useState<ProduksiSusu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSusu = async () => {
      try {
        const response = await api.get("/api/produksi-susu");
        setSusuList(response.data.data);
      } catch (err: any) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal memuat riwayat produksi susu.");
      } finally {
        setLoading(false);
      }
    };

    fetchSusu();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const filteredSusu = susuList.filter((s) => {
    const query = searchQuery.toLowerCase();
    const namaPemilik = s.pemilik?.name?.toLowerCase() || "";
    return (
      s.tanggal.includes(query) ||
      s.kepemilikan.toLowerCase().includes(query) ||
      namaPemilik.includes(query) ||
      (s.petugas && s.petugas.toLowerCase().includes(query))
    );
  });

  const totalKeseluruhan = filteredSusu.reduce(
    (acc, curr) => acc + Number(curr.total_liter),
    0,
  );

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Riwayat Susu</h1>
        <Link
          href="/input-data/produksi-susu"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center px-4 py-3 mb-6">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Cari tanggal, nama, atau petugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm outline-none text-gray-700 bg-transparent"
          />
        </div>

        {!loading && !error && filteredSusu.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl text-white">
                <Milk size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Total Filtered
                </p>
                <p className="text-lg font-black text-emerald-800">
                  {totalKeseluruhan.toFixed(2)} Liter
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Data
              </p>
              <p className="text-lg font-black text-emerald-800">
                {filteredSusu.length} Hari
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat riwayat...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : filteredSusu.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <Info size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-sm">Belum ada riwayat ditemukan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredSusu.map((susu) => (
              <div
                key={susu.id}
                className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${susu.kepemilikan === "Milik Sendiri" ? "bg-emerald-400" : "bg-amber-400"}`}></div>

                <div className="flex justify-between items-center ml-2 border-b border-gray-50 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={18} className="text-emerald-600" />
                    <span className="font-bold text-sm">
                      {formatDate(susu.tanggal)}
                    </span>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <span className="font-black text-emerald-700 text-sm">
                      {Number(susu.total_liter).toFixed(2)} L
                    </span>
                  </div>
                </div>

                <div className="ml-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Droplets
                      size={14}
                      className={
                        susu.kepemilikan === "Milik Sendiri"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }
                    />
                    <span>
                      {susu.kepemilikan === "Milik Sendiri"
                        ? "Milik Sendiri"
                        : `Stakeholder: ${susu.pemilik?.name || "Tidak Diketahui"}`}
                    </span>
                  </div>

                  {susu.petugas && (
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <User size={14} className="text-blue-500" />
                      <span>Petugas: {susu.petugas}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
