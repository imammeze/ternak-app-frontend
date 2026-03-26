"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Search, Info } from "lucide-react";
import api from "@/lib/axios";

interface Ternak {
  id_ternak: string;
  nama_ternak: string;
  jenis_ternak: string;
  jenis_kelamin: string;
  no_kandang: string;
  kepemilikan: string;
}

export default function DataTernakPage() {
  const [ternakList, setTernakList] = useState<Ternak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTernak = async () => {
      try {
        const response = await api.get("/api/ternak");
        setTernakList(response.data.data);
      } catch (err: any) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal memuat data ternak.");
      } finally {
        setLoading(false);
      }
    };

    fetchTernak();
  }, []);

  const filteredTernak = ternakList.filter(
    (t) =>
      t.nama_ternak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id_ternak.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Data Ternak</h1>
        <Link
          href="/input-data/ternak"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center px-4 py-3 mb-6">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Cari ID atau Nama Ternak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm outline-none text-gray-700 bg-transparent"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat data ternak...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : filteredTernak.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <Info size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-sm">
              Belum ada data ternak ditemukan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-1 px-1">
              <h2 className="font-bold text-gray-800">Daftar Ternak</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Total: {filteredTernak.length}
              </span>
            </div>

            {filteredTernak.map((ternak) => (
              <Link
                href={`/data-ternak/${ternak.id_ternak}`}
                key={ternak.id_ternak}
                className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between relative overflow-hidden hover:bg-gray-50 transition-colors">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${ternak.jenis_kelamin === "Jantan" ? "bg-blue-400" : "bg-rose-400"}`}></div>

                <div className="flex flex-col ml-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    {ternak.id_ternak}
                  </span>
                  <h3 className="font-bold text-gray-800 text-[16px] leading-tight mb-1">
                    {ternak.nama_ternak}
                  </h3>
                  <div className="flex gap-2 text-xs font-medium text-gray-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {ternak.jenis_ternak}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {ternak.no_kandang || "Tanpa Kandang"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${ternak.kepemilikan === "Milik Sendiri" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {ternak.kepemilikan}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
