"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Activity,
  Stethoscope,
  Pill,
  Syringe,
  FileText,
  ClipboardList,
} from "lucide-react";

export default function InputPerawatanPage() {
  const [formData, setFormData] = useState({
    tanggal_tindakan: "",
    id_ternak: "",
    diagnosa: "",
    obat: "",
    dosis: "",
    satuan_dosis: "ml",
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
    console.log("Data Perawatan Siap Dikirim:", formData);
    alert("Data perawatan siap dikirim! Cek console browser.");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-slate-50 text-emerald-900">
        <Link href="/input-data" className="cursor-pointer">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Input Perawatan Ternak</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Tanggal Tindakan
              </span>
            </div>
            <input
              type="date"
              name="tanggal_tindakan"
              value={formData.tanggal_tindakan}
              onChange={handleChange}
              className="text-[15px] font-medium text-gray-800 outline-none bg-transparent cursor-pointer text-right w-36"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  ID Ternak
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <Stethoscope size={20} className="text-emerald-600 mr-3" />
              <span className="text-[15px] font-medium text-gray-700">
                Diagnosa
              </span>
              <input
                type="text"
                name="diagnosa"
                value={formData.diagnosa}
                onChange={handleChange}
                placeholder="Masukkan diagnosa"
                className="flex-1 text-[15px] font-medium text-right text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <Pill size={20} className="text-emerald-600 mr-3" />
              <span className="text-[15px] font-medium text-gray-700">
                Obat
              </span>
              <input
                type="text"
                name="obat"
                value={formData.obat}
                onChange={handleChange}
                placeholder="Masukkan nama obat"
                className="flex-1 text-[15px] font-medium text-right text-gray-800 outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mt-1">
              <div className="flex items-center gap-3">
                <Syringe size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  Dosis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="dosis"
                  value={formData.dosis}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-16 text-[15px] font-medium text-gray-800 text-right outline-none bg-transparent border-b border-gray-300 focus:border-emerald-500"
                />
                <div className="relative">
                  <select
                    name="satuan_dosis"
                    value={formData.satuan_dosis}
                    onChange={handleChange}
                    className="appearance-none bg-transparent text-[15px] font-medium text-center text-gray-800 pr-4 outline-none cursor-pointer z-10">
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="cc">cc</option>
                    <option value="tablet">tablet</option>
                  </select>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transform rotate-90"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-3 px-3.5">
              <FileText size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Catatan
              </span>
            </div>
            <div className="border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={3}
                placeholder="Tambah catatan..."
                className="w-full text-[15px] font-medium text-gray-800 outline-none bg-transparent resize-none"></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#6db6a5] hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-colors tracking-wider">
            SIMPAN
          </button>
        </form>
      </div>
    </>
  );
}
