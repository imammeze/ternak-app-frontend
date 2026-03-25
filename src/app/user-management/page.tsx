"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Users, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: { name: string }[];
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Manajemen User</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
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
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Total: {users.length}
              </span>
            </div>

            {users.map((user) => {
              const roleName = user.roles?.[0]?.name || "Tanpa Role";
              const formattedRole =
                roleName.charAt(0).toUpperCase() + roleName.slice(1);

              const badgeColor =
                roleName === "admin"
                  ? "bg-rose-100 text-rose-700"
                  : roleName === "manager"
                    ? "bg-purple-100 text-purple-700"
                    : roleName === "stakeholder"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700";

              return (
                <div
                  key={user.id}
                  className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-[15px]">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${badgeColor}`}>
                    {formattedRole}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
