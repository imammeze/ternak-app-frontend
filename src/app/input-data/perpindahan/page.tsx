"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Tag,
  MapPin,
  Home,
  FileText,
  ArrowRightLeft,
} from "lucide-react";

export default function InputPerpindahanPage() {
  const [formData, setFormData] = useState({
    tanggal_tindakan: "",
    id_ternak: "",
    kandang_awal: "",
    kandang_tujuan: "",
    catatan: "",
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
    console.log("Data Perpindahan Siap Dikirim:", formData);
    alert("Data perpindahan siap dikirim! Cek console browser.");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-slate-50 text-emerald-900">
        <Link href="/input-data" className="cursor-pointer">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Input Perpindahan Ternak</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-emerald-700" />
              <span className="text-[15px] text-gray-600 font-medium">
                Tanggal
              </span>
            </div>
            <input
              type="date"
              name="tanggal_tindakan"
              value={formData.tanggal_tindakan}
              onChange={handleChange}
              className="text-[15px] font-medium text-gray-800 outline-none text-right bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  ID Ternak
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3 pointer-events-none">
              <Home size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Kandang Asal
              </span>
            </div>
            <select
              name="kandang_awal"
              value={formData.kandang_awal}
              onChange={handleChange}
              className="appearance-none bg-transparent text-[15px] text-right font-medium text-gray-800 outline-none cursor-pointer pr-8 absolute right-10">
              <option value="" disabled>
                Pilih kandang asal
              </option>
              <option value="KDG A01 - Kandang Timur">
                KDG A01 - Kandang Timur
              </option>
              <option value="KDG A02 - Kandang Barat">
                KDG A02 - Kandang Barat
              </option>
              <option value="KDG B01 - Karantina">KDG B01 - Karantina</option>
            </select>
            <ChevronRight
              size={18}
              className="text-gray-400 absolute right-10 pointer-events-none"
            />
          </div>

          <div className="flex justify-center -my-1 relative z-10">
            <div className="bg-emerald-100 p-2 rounded-full border-4 border-slate-50">
              <ArrowRightLeft
                size={16}
                className="text-emerald-600 transform rotate-90"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3 pointer-events-none">
              <MapPin size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Kandang Tujuan
              </span>
            </div>
            <select
              name="kandang_tujuan"
              value={formData.kandang_tujuan}
              onChange={handleChange}
              className="appearance-none bg-transparent text-[15px] text-right font-medium text-gray-800 outline-none cursor-pointer pr-8 absolute right-10">
              <option value="" disabled>
                Pilih kandang asal
              </option>
              <option value="KDG A01 - Kandang Timur">
                KDG A01 - Kandang Timur
              </option>
              <option value="KDG A02 - Kandang Barat">
                KDG A02 - Kandang Barat
              </option>
              <option value="KDG B01 - Karantina">KDG B01 - Karantina</option>
            </select>
            <ChevronRight
              size={18}
              className="text-gray-400 absolute right-10 pointer-events-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <FileText size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Pilih/ketik alasan perpindahan"
                className="flex-1 text-[15px] font-medium text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#6db6a5] hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-colors tracking-wider">
            SIMPAN DATA
          </button>
        </form>
      </div>
    </>
  );
}
