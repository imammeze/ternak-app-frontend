"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Plus,
  Home,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Hash,
  Users,
} from "lucide-react";
import api from "@/lib/axios";

interface Kandang {
  id: number;
  kode_kandang: string;
  nama_kandang: string;
  kapasitas: number;
  jenis: string;
  status: string;
  catatan: string | null;
}

export default function ManajemenKandangPage() {
  const [kandangList, setKandangList] = useState<Kandang[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addData, setAddData] = useState({
    kode_kandang: "",
    nama_kandang: "",
    kapasitas: "",
    jenis: "Umum",
    status: "Aktif",
    catatan: "",
  });
  const [addValidationErrors, setAddValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState<Kandang | null>(null);

  const fetchKandang = async () => {
    try {
      const response = await api.get("/api/kandang");
      setKandangList(response.data.data);
    } catch (err: any) {
      console.error("Gagal mengambil data:", err);
      setErrorMsg("Gagal memuat data kandang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKandang();
  }, []);

  const executeDelete = async (id: number) => {
    const loadingToast = toast.loading("Menghapus data...");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.delete(`/api/kandang/${id}`);
      setKandangList((prev) => prev.filter((kandang) => kandang.id !== id));
      toast.success("Kandang berhasil dihapus!", { id: loadingToast });
    } catch (err: any) {
      console.error("Gagal menghapus:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus kandang.", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = (id: number, nama: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in slide-in-from-top-5" : "animate-out fade-out slide-out-to-top-5"} max-w-sm w-full bg-white shadow-[0_20px_50px_rgb(0,0,0,0.1)] rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black/5 duration-300`}>
          <div className="p-5 flex gap-4 items-start">
            <div className="bg-rose-100 p-2.5 rounded-full shrink-0">
              <AlertCircle size={24} className="text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Hapus Kandang?
              </h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Yakin ingin menghapus <b>{nama}</b>? Data ini tidak dapat
                dikembalikan lagi.
              </p>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-bl-2xl transition-colors border-r border-gray-100">
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
      { duration: Infinity, id: `delete-confirm-${id}` },
    );
  };

  const openEditModal = (kandang: Kandang) => {
    setEditData(kandang);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    setIsSubmitting(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.put(`/api/kandang/${editData.id}`, editData);
      setKandangList((prev) =>
        prev.map((k) => (k.id === editData.id ? response.data.data : k)),
      );
      toast.success("Kandang berhasil diperbarui!");
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("Gagal update:", err);
      toast.error(err.response?.data?.message || "Gagal memperbarui data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setAddData({
      kode_kandang: "",
      nama_kandang: "",
      kapasitas: "",
      jenis: "Umum",
      status: "Aktif",
      catatan: "",
    });
    setAddValidationErrors({});
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddValidationErrors({});

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/kandang", {
        ...addData,
        kapasitas: Number(addData.kapasitas),
      });

      setKandangList((prev) => [response.data.data, ...prev]);

      toast.success("Kandang baru berhasil ditambahkan!");
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Gagal menambah kandang:", err);
      if (err.response?.status === 422) {
        setAddValidationErrors(err.response.data.errors);
        toast.error("Terdapat kesalahan pada isian form Anda.");
      } else {
        toast.error(
          err.response?.data?.message || "Gagal menyimpan data ke server.",
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="p-2 cursor-pointer transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold ml-2 tracking-wide">
            Manajemen Kandang
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="p-2 cursor-pointer bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <Plus size={22} />
        </button>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat data kandang...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium p-4 bg-rose-50 rounded-2xl border border-rose-100">
            {errorMsg}
          </div>
        ) : kandangList.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 flex flex-col items-center">
            <Home size={48} className="mb-3 opacity-50" />
            <p className="font-medium text-sm">Belum ada data kandang.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {kandangList.map((kandang) => (
              <div
                key={kandang.id}
                className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    kandang.status === "Aktif"
                      ? "bg-emerald-400"
                      : kandang.status === "Perawatan"
                        ? "bg-amber-400"
                        : "bg-gray-400"
                  }`}></div>

                <div className="flex justify-between items-start pl-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl mt-1 ${
                        kandang.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-600"
                          : kandang.status === "Perawatan"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-50 text-gray-600"
                      }`}>
                      <Home size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-800 leading-tight">
                        {kandang.nama_kandang}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        <Hash size={12} /> {kandang.kode_kandang} •{" "}
                        {kandang.jenis}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(kandang)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(kandang.id, kandang.nama_kandang)
                      }
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="pl-2 mt-4 grid grid-cols-2 gap-2 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600">
                    <Users size={14} className="text-purple-500" />
                    Kapasitas:{" "}
                    <span className="font-bold text-gray-800">
                      {kandang.kapasitas} Ekor
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600">
                    <AlertCircle
                      size={14}
                      className={
                        kandang.status === "Aktif"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }
                    />
                    Status:{" "}
                    <span className="font-bold text-gray-800">
                      {kandang.status}
                    </span>
                  </div>
                </div>

                {kandang.catatan && (
                  <div className="ml-2 mt-2 text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded-lg">
                    "{kandang.catatan}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-bold text-gray-800 text-lg">
                Tambah Kandang
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddSubmit}
              className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    Kode{" "}
                    {addValidationErrors.kode_kandang && (
                      <AlertCircle size={12} className="text-rose-500" />
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={addData.kode_kandang}
                    onChange={(e) => {
                      setAddData({ ...addData, kode_kandang: e.target.value });
                      if (addValidationErrors.kode_kandang)
                        setAddValidationErrors({
                          ...addValidationErrors,
                          kode_kandang: [],
                        });
                    }}
                    className={`w-full text-sm font-medium text-gray-800 border rounded-xl p-3 outline-none transition-colors ${addValidationErrors.kode_kandang ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-emerald-500"}`}
                  />
                  {addValidationErrors.kode_kandang && (
                    <span className="text-[10px] text-rose-500 font-bold">
                      {addValidationErrors.kode_kandang[0]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={addData.kapasitas}
                    onChange={(e) =>
                      setAddData({ ...addData, kapasitas: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Nama / Lokasi Kandang
                </label>
                <input
                  type="text"
                  required
                  value={addData.nama_kandang}
                  onChange={(e) =>
                    setAddData({ ...addData, nama_kandang: e.target.value })
                  }
                  className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Jenis
                  </label>
                  <select
                    value={addData.jenis}
                    onChange={(e) =>
                      setAddData({ ...addData, jenis: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors bg-white">
                    <option value="Umum">Umum</option>
                    <option value="Laktasi">Laktasi</option>
                    <option value="Karantina">Karantina</option>
                    <option value="Isolasi">Isolasi</option>
                    <option value="Pembibitan">Pembibitan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={addData.status}
                    onChange={(e) =>
                      setAddData({ ...addData, status: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors bg-white">
                    <option value="Aktif">Aktif</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Perawatan">Perawatan</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={addData.catatan}
                  onChange={(e) =>
                    setAddData({ ...addData, catatan: e.target.value })
                  }
                  className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Opsional..."></textarea>
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 tracking-wide ${
                  isAdding
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                }`}>
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "SIMPAN KANDANG"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editData && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-bold text-gray-800 text-lg">Edit Kandang</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Kode
                  </label>
                  <input
                    type="text"
                    required
                    value={editData.kode_kandang}
                    onChange={(e) =>
                      setEditData({ ...editData, kode_kandang: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editData.kapasitas}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        kapasitas: Number(e.target.value),
                      })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Nama Kandang
                </label>
                <input
                  type="text"
                  required
                  value={editData.nama_kandang}
                  onChange={(e) =>
                    setEditData({ ...editData, nama_kandang: e.target.value })
                  }
                  className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Jenis
                  </label>
                  <select
                    value={editData.jenis}
                    onChange={(e) =>
                      setEditData({ ...editData, jenis: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors bg-white">
                    <option value="Umum">Umum</option>
                    <option value="Laktasi">Laktasi</option>
                    <option value="Karantina">Karantina</option>
                    <option value="Isolasi">Isolasi</option>
                    <option value="Pembibitan">Pembibitan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors bg-white">
                    <option value="Aktif">Aktif</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Perawatan">Perawatan</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Catatan
                </label>
                <textarea
                  rows={2}
                  value={editData.catatan || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, catatan: e.target.value })
                  }
                  className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Opsional..."></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 tracking-wide ${
                  isSubmitting
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                }`}>
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "SIMPAN PERUBAHAN"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
