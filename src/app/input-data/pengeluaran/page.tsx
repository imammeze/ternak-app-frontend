"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Milk,
  Tag,
  Banknote,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

export default function InputPengeluaranSusuPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    susu_1l: "",
    susu_250ml: "",
    kategori: "",
    pembayaran: "Cash",
    customer: "",
    keterangan: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalLiter =
    (parseFloat(formData.susu_1l) || 0) * 1 +
    (parseFloat(formData.susu_250ml) || 0) * 0.25;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!formData.kategori) {
      setErrorMsg("Mohon pilih kategori pengeluaran terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    const payload = {
      tanggal: formData.tanggal,
      susu_1l: Number(formData.susu_1l) || 0,
      susu_250ml: Number(formData.susu_250ml) || 0,
      kategori: formData.kategori,
      pembayaran:
        formData.kategori === "Penjualan" ? formData.pembayaran : null,
      customer: formData.kategori === "Penjualan" ? formData.customer : null,
      total_liter: Number(totalLiter.toFixed(2)),
      keterangan: formData.keterangan,
    };

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/pengeluaran-susu", payload);

      toast.success("Data pengeluaran berhasil disimpan!");
      router.push("/input-data");
    } catch (err: any) {
      console.error("Gagal menyimpan:", err);
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
          href="/input-data"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Pengeluaran Susu</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Tanggal
              </span>
            </div>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              className="text-[15px] font-medium text-gray-800 outline-none bg-transparent cursor-pointer text-right w-36"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mt-2">
            <div className="flex items-center gap-3">
              <Milk size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu 1 L
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="susu_1l"
                value={formData.susu_1l}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-16 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Pcs</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Milk size={18} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu 250 ml
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="susu_250ml"
                value={formData.susu_250ml}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-16 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Pcs</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative mt-2">
            <div className="flex items-center gap-3 pointer-events-none">
              <Tag size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Kategori
              </span>
            </div>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="appearance-none bg-transparent text-[15px] font-medium text-gray-800 text-right pr-6 outline-none cursor-pointer absolute right-3 inset-y-0 pl-32">
              <option value="" disabled>
                Pilih Kategori
              </option>
              <option value="Penjualan">Penjualan</option>
              <option value="Transfer gudang">Transfer gudang</option>
              <option value="Rusak">Rusak</option>
              <option value="Tamu">Tamu</option>
            </select>
            <ChevronRight
              size={18}
              className="text-gray-400 absolute right-3 pointer-events-none"
            />
          </div>

          {formData.kategori === "Penjualan" && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative">
                <div className="flex items-center gap-3 pointer-events-none">
                  <Banknote size={20} className="text-emerald-700" />
                  <span className="text-[15px] text-gray-700 font-medium">
                    Pembayaran
                  </span>
                </div>
                <select
                  name="pembayaran"
                  value={formData.pembayaran}
                  onChange={handleChange}
                  className="appearance-none bg-transparent text-[15px] font-medium text-gray-800 text-right pr-6 outline-none cursor-pointer absolute right-3 inset-y-0 pl-32">
                  <option value="Cash">Cash / Tunai</option>
                  <option value="Transfer">Transfer</option>
                </select>
                <ChevronRight
                  size={18}
                  className="text-gray-400 absolute right-3 pointer-events-none"
                />
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-emerald-700" />
                  <span className="text-[15px] text-gray-700 font-medium whitespace-nowrap">
                    Customer
                  </span>
                </div>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="Nama / Instansi..."
                  className="text-[15px] font-medium text-gray-800 text-right outline-none w-full bg-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mt-2">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Keterangan
              </span>
            </div>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={2}
              placeholder="Tambahkan catatan jika diperlukan..."
              className="w-full text-[14px] text-gray-800 focus:outline-none resize-none bg-transparent"></textarea>
          </div>

          <div className="mt-4 bg-emerald-100/50 rounded-2xl py-4 flex flex-col items-center justify-center border border-emerald-100">
            <span className="text-emerald-800 font-medium text-sm">
              Total Pengeluaran
            </span>
            <span className="text-emerald-700 font-black text-2xl">
              {totalLiter > 0 ? totalLiter.toFixed(2) : "0"} Liter
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full text-white font-semibold py-4 rounded-xl shadow-lg transition-colors tracking-wider mb-8 flex justify-center items-center gap-2 ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"
            }`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIMPAN PENGELUARAN"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
