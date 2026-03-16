import { User } from "lucide-react";

export default function ProfileStats() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center text-white">
          <User size={28} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Nama Admin</h2>
          <p className="text-sm text-gray-500">Nama Admin</p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Ternak</p>
          <p className="text-xl font-bold text-emerald-800">120</p>
        </div>
        <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Susu</p>
          <p className="text-xl font-bold text-emerald-800">
            45 <span className="text-sm">L</span>
          </p>
        </div>
        <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">User</p>
          <p className="text-xl font-bold text-emerald-800">6</p>
        </div>
      </div>
    </div>
  );
}
