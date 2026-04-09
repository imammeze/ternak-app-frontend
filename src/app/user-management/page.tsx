"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Users,
  ShieldAlert,
  Plus,
  Edit,
  X,
  User as UserIcon,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: { name: string }[];
}

export default function UserManagementPage() {
  const { user: currentUser } = useAuthStore();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data.users);
    } catch (err: any) {
      console.error("Gagal mengambil data user:", err);
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki izin untuk melihat halaman ini.");
      } else {
        setError("Terjadi kesalahan saat mengambil data dari server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    if (!addFormData.role) {
      toast.error("Mohon pilih Role / Hak Akses untuk user ini.");
      setIsAdding(false);
      return;
    }
    if (addFormData.password.length < 8) {
      toast.error("Password minimal harus 8 karakter.");
      setIsAdding(false);
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/users", addFormData);
      await fetchUsers();

      toast.success("User baru berhasil ditambahkan!");
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Gagal menambah user:", err);
      toast.error(
        err.response?.data?.message || "Gagal menyimpan data ke server.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setEditData({
      id: user.id,
      name: user.name,
      role: user.roles?.[0]?.name || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    setIsUpdating(true);
    try {
      await api.get("/sanctum/csrf-cookie");

      await api.put(`/api/users/${editData.id}`, { role: editData.role });

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === editData.id) {
            return { ...u, roles: [{ name: editData.role }] };
          }
          return u;
        }),
      );

      toast.success("Role pengguna berhasil diperbarui!");
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("Gagal update role:", err);
      toast.error(err.response?.data?.message || "Gagal memperbarui role.");
    } finally {
      setIsUpdating(false);
    }
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setAddFormData({ name: "", email: "", password: "", role: "" });
    setEditData(null);
  };

  const getBadgeColor = (roleName: string) => {
    if (roleName === "admin")
      return "bg-rose-100 text-rose-700 border border-rose-200";
    if (roleName === "manager")
      return "bg-purple-100 text-purple-700 border border-purple-200";
    if (roleName === "stakeholder")
      return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-blue-100 text-blue-700 border border-blue-200";
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Manajemen User</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat data pengguna...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex flex-col items-center text-center mt-10">
            <ShieldAlert size={48} className="text-rose-500 mb-4" />
            <h2 className="text-rose-800 font-bold text-lg mb-2">
              Akses Ditolak
            </h2>
            <p className="text-rose-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2 px-1">
              <h2 className="font-bold text-gray-800">Daftar Pengguna</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Total: {users.length}
              </span>
            </div>

            {users.map((user) => {
              const roleName = user.roles?.[0]?.name || "Tanpa Role";
              const formattedRole =
                roleName.charAt(0).toUpperCase() + roleName.slice(1);
              const badgeColor = getBadgeColor(roleName);

              const isSelf = currentUser?.email === user.email;

              return (
                <div
                  key={user.id}
                  className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isSelf ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-gray-400"}`}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-[15px] flex items-center gap-2">
                        {user.name}
                        {isSelf && (
                          <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                            Anda
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`text-[10px] font-bold px-3 py-1 rounded-full ${badgeColor}`}>
                      {formattedRole}
                    </div>

                    {!isSelf && (
                      <button
                        onClick={() => openEditModal(user)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        <Edit size={12} /> Ubah Role
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-bold text-gray-800">Tambah User Baru</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddSubmit}
              className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
                <UserIcon size={20} className="text-emerald-600 mr-3" />
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, name: e.target.value })
                    }
                    placeholder="Masukkan nama..."
                    className="w-full text-[14px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
                <Mail size={20} className="text-emerald-600 mr-3" />
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={addFormData.email}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, email: e.target.value })
                    }
                    placeholder="nama@email.com"
                    className="w-full text-[14px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 transition-all">
                <Lock size={20} className="text-emerald-600 mr-3" />
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Kata Sandi (Min 8)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={addFormData.password}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full text-[14px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative mt-2">
                <div className="flex items-center gap-3 pointer-events-none z-10">
                  <ShieldCheck size={22} className="text-emerald-700" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Pilih Role / Hak Akses
                    </span>
                  </div>
                </div>
                <select
                  required
                  value={addFormData.role}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, role: e.target.value })
                  }
                  className="appearance-none bg-transparent text-[14px] font-bold text-gray-800 text-right pr-6 outline-none cursor-pointer absolute right-3 inset-y-0 pl-32 z-20">
                  <option value="" disabled>
                    -- Pilih --
                  </option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="stakeholder">Stakeholder</option>
                  <option value="karyawan">Karyawan</option>
                </select>
                <ChevronRight
                  size={18}
                  className="text-gray-400 absolute right-3 pointer-events-none z-10"
                />
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className={`mt-4 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 tracking-wider ${isAdding ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"}`}>
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "BUAT AKUN"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editData && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-bold text-gray-800">Ubah Role Pengguna</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
                    Nama Karyawan
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editData.name}
                  </h3>
                </div>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative focus-within:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3 pointer-events-none z-10">
                    <ShieldCheck size={22} className="text-emerald-700" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Hak Akses Baru
                      </span>
                    </div>
                  </div>
                  <select
                    required
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                    className="appearance-none bg-transparent text-[15px] font-bold text-gray-800 text-right pr-6 outline-none cursor-pointer absolute right-3 inset-y-0 pl-32 z-20">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="stakeholder">Stakeholder</option>
                    <option value="karyawan">Karyawan</option>
                  </select>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 absolute right-3 pointer-events-none z-10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`mt-6 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 tracking-wider ${isUpdating ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"}`}>
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "SIMPAN PERUBAHAN ROLE"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
