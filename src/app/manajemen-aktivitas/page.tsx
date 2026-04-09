"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  ListChecks,
} from "lucide-react";
import api from "@/lib/axios";

interface Aktivitas {
  id: number;
  nama_aktivitas: string;
  kategori: string;
  status: string;
}

export default function ManajemenAktivitasPage() {
  const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama_aktivitas: "",
    kategori: "Umum",
    status: "Aktif",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAktivitas = async () => {
      try {
        const response = await api.get("/api/aktivitas");
        setAktivitasList(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAktivitas();
  }, []);

  const executeDelete = async (id: number) => {
    const loadingToast = toast.loading("Menghapus aktivitas...");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.delete(`/api/aktivitas/${id}`);
      setAktivitasList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Aktivitas dihapus!", { id: loadingToast });
    } catch (err) {
      toast.error("Gagal menghapus aktivitas.", { id: loadingToast });
    }
  };

  const handleDelete = (id: number, nama: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in slide-in-from-top-5" : "animate-out fade-out slide-out-to-top-5"} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black/5 duration-300`}>
          <div className="p-5 flex gap-4 items-start">
            <div className="bg-rose-100 p-2.5 rounded-full shrink-0">
              <AlertCircle size={24} className="text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Hapus Aktivitas?</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Yakin menghapus <b>{nama}</b>?
              </p>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-bl-2xl transition-colors">
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(id);
              }}
              className="w-full py-3.5 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-br-2xl transition-colors">
              Ya, Hapus
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: `del-${id}` },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      if (isEditModalOpen && editId) {
        const res = await api.put(`/api/aktivitas/${editId}`, formData);
        setAktivitasList((prev) =>
          prev.map((item) => (item.id === editId ? res.data.data : item)),
        );
        toast.success("Aktivitas diperbarui!");
      } else {
        const res = await api.post("/api/aktivitas", formData);
        setAktivitasList((prev) => [res.data.data, ...prev]);
        toast.success("Aktivitas ditambahkan!");
      }
      closeModal();
    } catch (err) {
      toast.error("Gagal menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setFormData({ nama_aktivitas: "", kategori: "Umum", status: "Aktif" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: Aktivitas) => {
    setFormData({
      nama_aktivitas: item.nama_aktivitas,
      kategori: item.kategori || "Umum",
      status: item.status,
    });
    setEditId(item.id);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="p-2 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold ml-2">Manajemen Aktivitas</h1>
        </div>
        <button
          onClick={openAddModal}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <Plus size={22} />
        </button>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : aktivitasList.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <ListChecks size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada data aktivitas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {aktivitasList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex justify-between items-center relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === "Aktif" ? "bg-emerald-400" : "bg-gray-300"}`}></div>
                <div className="pl-3">
                  <h3 className="font-bold text-gray-800 text-[15px]">
                    {item.nama_aktivitas}
                  </h3>
                  <div className="flex gap-2 mt-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.status === "Aktif" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.nama_aktivitas)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-bold text-gray-800">
                {isEditModalOpen ? "Edit" : "Tambah"} Aktivitas
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Nama Pekerjaan
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_aktivitas}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_aktivitas: e.target.value })
                  }
                  className="w-full text-[14px] font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Misal: Beri Pakan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Status Aktivitas
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full text-[14px] font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors bg-white">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Status Nonaktif tidak akan muncul di halaman absen Karyawan.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center ${isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-200"}`}>
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "SIMPAN DATA"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
