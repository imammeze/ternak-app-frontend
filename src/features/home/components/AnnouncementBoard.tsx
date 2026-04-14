"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Megaphone,
  CalendarDays,
  ChevronRight,
  Plus,
  X,
  Edit,
  Trash2,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { createPortal } from "react-dom";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  created_at: string;
  user_id: number;
  user?: { id: number; name: string };
}

export default function AnnouncementBoard() {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ judul: "", isi: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchPengumuman();
  }, [isAuthenticated]);

  const fetchPengumuman = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/api/pengumuman");
      setPengumumanList(res.data.data);
    } catch (err) {
      console.error("Gagal load pengumuman", err);
    }
  };

  if (!isClient) return null;

  const roleName = currentUser?.roles?.[0]?.name.toLowerCase() || "";
  const showPengumuman = isAuthenticated && roleName !== "stakeholder";

  if (!showPengumuman) return null;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/pengumuman", formData);
      setPengumumanList((prev) => [res.data.data, ...prev]);
      toast.success("Pengumuman berhasil diterbitkan!");
      closeModals();
    } catch (err) {
      toast.error("Gagal menerbitkan pengumuman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsSubmitting(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      const res = await api.put(`/api/pengumuman/${editId}`, formData);
      setPengumumanList((prev) =>
        prev.map((item) => (item.id === editId ? res.data.data : item)),
      );
      toast.success("Pengumuman diperbarui!");
      closeModals();
      setIsListModalOpen(true);
    } catch (err) {
      toast.error("Gagal memperbarui pengumuman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async (id: number) => {
    const loadingToast = toast.loading("Menghapus...");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.delete(`/api/pengumuman/${id}`);
      setPengumumanList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Dihapus!", { id: loadingToast });
    } catch (err) {
      toast.error("Gagal menghapus.", { id: loadingToast });
    }
  };

  const handleDelete = (id: number) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in slide-in-from-top-5" : "animate-out fade-out slide-out-to-top-5"} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black/5 z-999999`}>
          <div className="p-5 flex gap-4 items-start">
            <div className="bg-rose-100 p-2.5 rounded-full shrink-0">
              <AlertCircle size={24} className="text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Hapus Pengumuman?</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-bl-2xl">
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(id);
              }}
              className="w-full py-3.5 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-br-2xl">
              Hapus
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: `del-${id}` },
    );
  };

  const openAddModal = () => {
    setFormData({ judul: "", isi: "" });
    setIsListModalOpen(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: Pengumuman) => {
    setFormData({ judul: item.judul, isi: item.isi });
    setEditId(item.id);
    setIsListModalOpen(false);
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsListModalOpen(false);
    setEditId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const latestAnnouncement =
    pengumumanList.length > 0 ? pengumumanList[0] : null;

  return (
    <>
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-gray-800 text-sm">Pengumuman</h3>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer">
            <Plus size={14} strokeWidth={3} /> Buat Baru
          </button>
        </div>

        {latestAnnouncement ? (
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 text-white shadow-[0_8px_30px_rgb(59,130,246,0.2)] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0 border border-white/10 shadow-inner">
                <Megaphone size={24} className="text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-[15px] leading-tight mb-1 pr-2 line-clamp-1">
                    {latestAnnouncement.judul}
                  </h4>
                  <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Terbaru
                  </span>
                </div>

                <p className="text-blue-50 text-[12px] leading-relaxed opacity-90 mb-3 line-clamp-2">
                  {latestAnnouncement.isi}
                </p>

                <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium bg-black/10 w-max px-2.5 py-1.5 rounded-lg backdrop-blur-md">
                    <CalendarDays size={12} />{" "}
                    {formatDate(latestAnnouncement.created_at)}
                  </div>

                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-blue-100 transition-colors cursor-pointer">
                    Semua Info <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm flex flex-col items-center justify-center">
            <Megaphone size={32} className="text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              Belum ada pengumuman.
            </p>
          </div>
        )}
      </div>

      {isListModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-99998 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-t-3xl sm:rounded-t-3xl sticky top-0 z-10 shrink-0">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Megaphone size={20} className="text-blue-500" /> Semua
                  Pengumuman
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
                {pengumumanList.map((item) => {
                  const isOwner = currentUser?.id === String(item.user_id);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative">
                      <h4 className="font-bold text-gray-800 text-[15px] pr-16 leading-snug">
                        {item.judul}
                      </h4>
                      <p className="text-[13px] text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                        {item.isi}
                      </p>

                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                        <div className="flex items-center gap-1.5">
                          <User
                            size={14}
                            className={
                              isOwner ? "text-emerald-500" : "text-blue-500"
                            }
                          />
                          {isOwner ? "Anda" : item.user?.name || "Sistem"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-gray-400" />{" "}
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      {isOwner && (
                        <div className="absolute top-4 right-4 flex gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {(isAddModalOpen || isEditModalOpen) &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
                <h3 className="font-bold text-gray-800 text-lg">
                  {isEditModalOpen ? "Edit" : "Buat"} Pengumuman
                </h3>
                <button
                  onClick={() => {
                    if (isEditModalOpen) {
                      setIsEditModalOpen(false);
                      setIsListModalOpen(true);
                    } else closeModals();
                  }}
                  className="text-gray-400 hover:bg-gray-200 bg-white rounded-full p-1.5 shadow-sm transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
                className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    className="w-full text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-colors"
                    placeholder="Contoh: Rapat Evaluasi Bulanan"
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Isi Pesan
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.isi}
                    onChange={(e) =>
                      setFormData({ ...formData, isi: e.target.value })
                    }
                    className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-blue-500 resize-none transition-colors"
                    placeholder="Tuliskan detail pengumuman di sini..."></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"}`}>
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "PUBLIKASIKAN"
                  )}
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
