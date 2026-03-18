"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CalendarDays,
  Milk,
  Baby,
  FileText,
  User,
} from "lucide-react";

export default function InputProduksiSusuPage() {
  const [formData, setFormData] = useState({
    tanggal: "",
    pagi_1l: "",
    pagi_250ml: "",
    pagi_cempe: "",
    sore_1l: "",
    sore_250ml: "",
    sore_cempe: "",
    petugas: "",
    catatan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Produksi Susu:", formData);
    console.log("Total Liter:", totalProduksi);
    alert("Data produksi susu siap dikirim! Cek console.");
  };

  const totalProduksi = (
    (parseFloat(formData.pagi_1l) || 0) * 1 +
    (parseFloat(formData.pagi_250ml) || 0) * 0.25 +
    (parseFloat(formData.pagi_cempe) || 0) / 1000 +
    (parseFloat(formData.sore_1l) || 0) * 1 +
    (parseFloat(formData.sore_250ml) || 0) * 0.25 +
    (parseFloat(formData.sore_cempe) || 0) / 1000
  ).toFixed(2);

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-slate-50 text-emerald-900 z-10 sticky top-0">
        <Link href="/input-data" className="cursor-pointer">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Input Produksi Susu</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mb-2">
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

          <h2 className="text-sm font-semibold text-gray-500 mt-2 ml-1">
            Susu Pagi
          </h2>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Milk size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu Pagi 1 L
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="pagi_1l"
                value={formData.pagi_1l}
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
                Susu Pagi 250 ml
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="pagi_250ml"
                value={formData.pagi_250ml}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-12 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Botol</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Baby size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu Pagi Cempe
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="pagi_cempe"
                value={formData.pagi_cempe}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-16 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">ml</span>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-500 mt-3 ml-1">
            Susu Sore
          </h2>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Milk size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu Sore 1 L
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="sore_1l"
                value={formData.sore_1l}
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
                Susu Sore 250 ml
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="sore_250ml"
                value={formData.sore_250ml}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-12 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">Botol</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Baby size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Susu Sore Cempe
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                name="sore_cempe"
                value={formData.sore_cempe}
                onChange={handleChange}
                placeholder="0"
                className="text-[15px] font-semibold text-gray-800 text-right outline-none w-16 bg-transparent"
              />
              <span className="text-[14px] text-gray-400">ml</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-[15px] font-bold text-gray-800">
              Total Produksi
            </span>
            <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl border border-emerald-100">
              {totalProduksi > "0.00" ? totalProduksi : "0"} Liter
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-500 mt-3 ml-1">
            Petugas & Catatan
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <User size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                name="petugas"
                value={formData.petugas}
                onChange={handleChange}
                placeholder="Nama Petugas"
                className="flex-1 text-[15px] font-medium text-gray-800 outline-none bg-transparent"
              />
            </div>

            <div className="border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={2}
                placeholder="Tambah catatan..."
                className="w-full text-[15px] font-medium text-gray-800 outline-none bg-transparent resize-none"></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#6db6a5] hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-colors tracking-wider mb-8">
            SIMPAN
          </button>
        </form>
      </div>
    </>
  );
}
