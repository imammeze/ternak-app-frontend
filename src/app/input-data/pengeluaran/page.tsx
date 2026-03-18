"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Milk,
  Tag,
  Banknote,
  User,
  FileText,
} from "lucide-react";

export default function InputSusuPage() {
  const [formData, setFormData] = useState({
    tanggal: "",
    susu_1l: "",
    susu_250ml: "",
    kategori: "",
    pembayaran: "Cash",
    customer: "",
    keterangan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Susu Siap Dikirim:", formData);
    alert("Data siap dikirim! Cek console browser.");
  };

  const totalLiter =
    (parseFloat(formData.susu_1l) || 0) * 1 +
    (parseFloat(formData.susu_250ml) || 0) * 0.25;

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-slate-50 text-emerald-900">
        <Link href="/input-data" className="cursor-pointer">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Input Pengeluaran Susu</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
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
              className="text-[15px] font-medium text-gray-800 outline-none bg-transparent cursor-pointer text-right w-36"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
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
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-12 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Liter</span>
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
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-12 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Botol</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative">
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
              <option value="Cempe">Cempe</option>
              <option value="Tamu">Tamu</option>
            </select>
            <ChevronRight
              size={18}
              className="text-gray-400 absolute right-3 pointer-events-none"
            />
          </div>

          {formData.kategori === "Penjualan" && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
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
                  placeholder="Nama / Instansi"
                  className="text-[15px] font-medium text-gray-800 text-right outline-none w-full bg-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mt-1">
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

          <div className="mt-4 bg-emerald-100/50 rounded-2xl py-4 flex items-center justify-center border border-emerald-100">
            <span className="text-emerald-800 font-medium">
              Total Pengeluaran{" "}
            </span>
            <span className="text-emerald-900 font-bold ml-2">
              {totalLiter > 0 ? totalLiter : "0"} Liter
            </span>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-[#6db6a5] hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-colors tracking-wider">
            SIMPAN DATA
          </button>
        </form>
      </div>
    </>
  );
}
