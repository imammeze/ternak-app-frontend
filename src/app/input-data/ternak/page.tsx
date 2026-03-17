"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";

export default function InputTernakPage() {
  const [formData, setFormData] = useState({
    id_ternak: "",
    nama_ternak: "",
    jenis_ternak: "Sapera",
    jenis_kelamin: "Jantan",
    no_kandang: "",
    kepemilikan: "Milik Sendiri",
    asal_usul: "Beli",
    harga_beli: "",
    tanggal_lahir: "",
    berat_lahir: "",
    id_induk: "",
    id_pejantan: "",
    tipe_kelahiran: "Singel",
    catatan: "",
  });

  const [foto, setFoto] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    if (foto) {
      submitData.append("foto", foto);
    }

    console.log("Data Form Siap Dikirim:", formData);
    console.log("File Foto:", foto);
    alert("Cek Console Browser untuk melihat data form!");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-slate-50 text-emerald-900">
        <Link href="/input-data" className="cursor-pointer">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Input Ternak</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-2 pb-32 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">ID Ternak</span>
            <input
              type="text"
              name="id_ternak"
              value={formData.id_ternak}
              onChange={handleChange}
              placeholder="Masukkan ID Ternak"
              className="text-sm font-medium text-gray-800 text-right outline-none w-48 bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Nama Ternak</span>
            <input
              type="text"
              name="nama_ternak"
              value={formData.nama_ternak}
              onChange={handleChange}
              placeholder="Masukkan nama ternak"
              className="text-sm font-medium text-gray-800 text-right outline-none w-48 bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Jenis Ternak</span>
            <select
              name="jenis_ternak"
              value={formData.jenis_ternak}
              onChange={handleChange}
              className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center pr-6 outline-none cursor-pointer z-10">
              <option value="Sapera">Sapera</option>
              <option value="Sanen">Sanen</option>
              <option value="Etawa">Etawa</option>
              <option value="Jawa Randu">Jawa Randu</option>
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Jenis Kelamin</span>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center pr-6 outline-none cursor-pointer z-10">
              <option value="Jantan">Jantan</option>
              <option value="Betina">Betina</option>
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">No Kandang</span>
            <input
              type="text"
              name="no_kandang"
              value={formData.no_kandang}
              onChange={handleChange}
              placeholder="Contoh: KDG A02"
              className="text-sm font-medium text-gray-800 text-right outline-none w-32 bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Kepemilikan</span>
            <select
              name="kepemilikan"
              value={formData.kepemilikan}
              onChange={handleChange}
              className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center pr-6 outline-none cursor-pointer z-10">
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Titipan">Titipan</option>
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Asal Usul</span>
            <select
              name="asal_usul"
              value={formData.asal_usul}
              onChange={handleChange}
              className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center pr-6 outline-none cursor-pointer z-10">
              <option value="Beli">Beli</option>
              <option value="Lahir">Lahir</option>
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
            <span className="text-sm text-gray-600">Harga Beli</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-800">Rp</span>
              <input
                type="number"
                name="harga_beli"
                value={formData.harga_beli}
                onChange={handleChange}
                placeholder="0"
                className="text-sm font-medium text-gray-800 text-right outline-none w-24 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
            <span className="text-sm text-gray-600">Tanggal Lahir</span>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="text-sm font-medium text-gray-800 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
            <span className="text-sm text-gray-600">Berat Lahir</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                name="berat_lahir"
                value={formData.berat_lahir}
                onChange={handleChange}
                placeholder="3"
                step="0.1"
                className="text-sm font-medium text-gray-800 text-right outline-none w-16 bg-transparent"
              />
              <span className="text-sm font-medium text-gray-800">kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1 ml-1">
                ID Induk
              </label>
              <input
                type="text"
                name="id_induk"
                value={formData.id_induk}
                onChange={handleChange}
                placeholder="Opsional"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1 ml-1">
                ID Pejantan
              </label>
              <input
                type="text"
                name="id_pejantan"
                value={formData.id_pejantan}
                onChange={handleChange}
                placeholder="Opsional"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative">
            <span className="text-sm text-gray-600">Tipe Kelahiran</span>
            <select
              name="tipe_kelahiran"
              value={formData.tipe_kelahiran}
              onChange={handleChange}
              className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center pr-6 outline-none cursor-pointer z-10">
              <option value="Singel">Singel</option>
              <option value="Twin">Twin (Kembar 2)</option>
              <option value="Triplet">Triplet (Kembar 3)</option>
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5 ml-1">
              Foto Ternak
            </label>
            <label
              className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                foto
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud
                  size={24}
                  className={
                    foto ? "text-emerald-600 mb-2" : "text-emerald-500 mb-2"
                  }
                />
                <p className="text-xs text-gray-500 font-medium text-center px-4">
                  {foto
                    ? `File terpilih: ${foto.name}`
                    : "Klik untuk upload foto"}
                </p>
              </div>
              <input
                type="file"
                name="foto"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5 ml-1">
              Catatan Tambahan
            </label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              rows={3}
              placeholder="Tambahkan catatan khusus..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 resize-none"></textarea>
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
