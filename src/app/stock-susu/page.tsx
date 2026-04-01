"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Milk,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Info,
  Package,
  Filter,
  User,
  Tag,
  Box,
} from "lucide-react";
import api from "@/lib/axios";

interface RiwayatStok {
  id: string;
  tanggal: string;
  waktu_input: string;
  tipe: "masuk" | "keluar";
  total_liter: number;
  qty_1l: number;
  qty_250ml: number;
  kategori: string;
  aktor: string;
  catatan: string;
}

export default function StokSusuPage() {
  const [riwayat, setRiwayat] = useState<RiwayatStok[]>([]);
  const [stokSaatIni, setStokSaatIni] = useState(0);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);

  const [stok1L, setStok1L] = useState(0);
  const [stok250ml, setStok250ml] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"semua" | "masuk" | "keluar">("semua");

  useEffect(() => {
    const fetchDataStok = async () => {
      try {
        const [resProduksi, resPengeluaran] = await Promise.all([
          api.get("/api/produksi-susu"),
          api.get("/api/pengeluaran-susu"),
        ]);

        const dataProduksi = resProduksi.data.data;
        const dataPengeluaran = resPengeluaran.data.data;

        const sumMasuk = dataProduksi.reduce((acc: number, curr: any) => {
          const liter1L =
            (Number(curr.pagi_1l || 0) + Number(curr.sore_1l || 0)) * 1;
          const liter250ml =
            (Number(curr.pagi_250ml || 0) + Number(curr.sore_250ml || 0)) *
            0.25;
          return acc + liter1L + liter250ml;
        }, 0);

        const sumKeluar = dataPengeluaran.reduce(
          (acc: number, curr: any) => acc + Number(curr.total_liter),
          0,
        );

        setTotalMasuk(sumMasuk);
        setTotalKeluar(sumKeluar);
        setStokSaatIni(sumMasuk - sumKeluar);

        const masuk1L = dataProduksi.reduce(
          (acc: number, curr: any) =>
            acc + Number(curr.pagi_1l || 0) + Number(curr.sore_1l || 0),
          0,
        );
        const masuk250ml = dataProduksi.reduce(
          (acc: number, curr: any) =>
            acc + Number(curr.pagi_250ml || 0) + Number(curr.sore_250ml || 0),
          0,
        );

        const keluar1L = dataPengeluaran.reduce(
          (acc: number, curr: any) => acc + Number(curr.susu_1l || 0),
          0,
        );
        const keluar250ml = dataPengeluaran.reduce(
          (acc: number, curr: any) => acc + Number(curr.susu_250ml || 0),
          0,
        );

        setStok1L(masuk1L - keluar1L);
        setStok250ml(masuk250ml - keluar250ml);

        const formatProduksi: RiwayatStok[] = dataProduksi.map((item: any) => {
          const storableLiters =
            (Number(item.pagi_1l || 0) + Number(item.sore_1l || 0)) * 1 +
            (Number(item.pagi_250ml || 0) + Number(item.sore_250ml || 0)) *
              0.25;

          return {
            id: `prod-${item.id}`,
            tanggal: item.tanggal,
            waktu_input: item.created_at,
            tipe: "masuk",
            total_liter: storableLiters,
            qty_1l: Number(item.pagi_1l || 0) + Number(item.sore_1l || 0),
            qty_250ml:
              Number(item.pagi_250ml || 0) + Number(item.sore_250ml || 0),
            kategori: "Produksi Harian",
            aktor: item.petugas || "Petugas Tidak Diketahui",
            catatan: item.catatan || "",
          };
        });

        const formatPengeluaran: RiwayatStok[] = dataPengeluaran.map(
          (item: any) => ({
            id: `peng-${item.id}`,
            tanggal: item.tanggal,
            waktu_input: item.created_at,
            tipe: "keluar",
            total_liter: Number(item.total_liter),
            qty_1l: Number(item.susu_1l || 0),
            qty_250ml: Number(item.susu_250ml || 0),
            kategori: item.kategori,
            aktor: item.customer
              ? `Customer: ${item.customer}`
              : item.pembayaran || "-",
            catatan: item.keterangan || "",
          }),
        );

        const combinedData = [...formatProduksi, ...formatPengeluaran].sort(
          (a, b) =>
            new Date(b.waktu_input).getTime() -
            new Date(a.waktu_input).getTime(),
        );

        setRiwayat(combinedData);
      } catch (err) {
        console.error("Gagal mengambil data stok:", err);
        setError("Gagal memuat data riwayat stok susu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataStok();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredRiwayat = riwayat.filter((item) => {
    if (filter === "semua") return true;
    return item.tipe === filter;
  });

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Info Stok Susu</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {!loading && !error && (
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-emerald-50 opacity-50 pointer-events-none">
              <Milk size={120} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center border-b border-gray-100 pb-4 mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Package size={16} /> Stok Tersedia
              </span>
              <div className="text-5xl font-black text-emerald-600 tracking-tight">
                {stokSaatIni.toFixed(2)}{" "}
                <span className="text-2xl font-bold text-emerald-400">L</span>
              </div>

              <div className="flex items-center gap-3 mt-4 w-full">
                <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 border border-emerald-100 rounded-xl py-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    Ukuran 1 L
                  </span>
                  <span className="text-lg font-black text-emerald-800">
                    {stok1L}{" "}
                    <span className="text-xs font-bold text-emerald-600">
                      Pcs
                    </span>
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 border border-emerald-100 rounded-xl py-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    Ukuran 250 ml
                  </span>
                  <span className="text-lg font-black text-emerald-800">
                    {stok250ml}{" "}
                    <span className="text-xs font-bold text-emerald-600">
                      Pcs
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500">
                  <ArrowDownCircle size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">
                    Total Masuk
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {totalMasuk.toFixed(2)} L
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                  <ArrowUpCircle size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">
                    Total Keluar
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {totalKeluar.toFixed(2)} L
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && riwayat.length > 0 && (
          <div className="flex items-center gap-2 mb-6 bg-gray-200/50 p-1 rounded-xl">
            {(["semua", "masuk", "keluar"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                  filter === f
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-200"
                }`}>
                {f}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Menghitung kalkulasi stok...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : filteredRiwayat.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <Filter size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-sm">
              Tidak ada riwayat untuk filter ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-sm px-1">
              Riwayat Transaksi (Terbaru)
            </h3>

            {filteredRiwayat.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-3 relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.tipe === "masuk" ? "bg-blue-400" : "bg-rose-400"}`}></div>
                <div
                  className={`mt-1 p-2.5 rounded-2xl shrink-0 ${item.tipe === "masuk" ? "bg-blue-50 text-blue-500" : "bg-rose-50 text-rose-500"}`}>
                  {item.tipe === "masuk" ? (
                    <ArrowDownCircle size={22} />
                  ) : (
                    <ArrowUpCircle size={22} />
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 text-[15px] leading-tight">
                      {item.kategori}
                    </h4>
                    <span
                      className={`font-black text-[15px] whitespace-nowrap ${item.tipe === "masuk" ? "text-blue-600" : "text-rose-600"}`}>
                      {item.tipe === "masuk" ? "+" : "-"}
                      {item.total_liter} L
                    </span>
                  </div>

                  {(item.qty_1l > 0 || item.qty_250ml > 0) && (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {item.qty_1l > 0 && (
                        <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-bold">
                          <Box size={10} /> 1L: {item.qty_1l} Pcs
                        </div>
                      )}
                      {item.qty_250ml > 0 && (
                        <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-bold">
                          <Box size={10} /> 250ml: {item.qty_250ml} Pcs
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1.5">
                    <Calendar size={12} className="text-emerald-500" />
                    <span>{formatDate(item.tanggal)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                    {item.tipe === "masuk" ? (
                      <User size={12} />
                    ) : (
                      <Tag size={12} />
                    )}
                    <span className="truncate max-w-[180px]">{item.aktor}</span>
                  </div>

                  {item.catatan && (
                    <div className="mt-2 text-[12px] bg-gray-50 p-2 rounded-lg text-gray-600 italic border border-gray-100">
                      "{item.catatan}"
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
