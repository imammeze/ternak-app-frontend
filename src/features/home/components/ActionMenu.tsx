import Link from "next/link";
import { Pencil, Milk, ShieldQuestion, Users } from "lucide-react";

export default function ActionMenu() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link
        href="/input-data"
        className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
        <Pencil size={32} className="text-emerald-600 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">Input Data</span>
      </Link>
      <button className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all">
        <Milk size={32} className="text-emerald-600 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">Produksi Susu</span>
      </button>
      <button className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all">
        <ShieldQuestion size={32} className="text-emerald-600 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">Data Ternak</span>
      </button>
      <button className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all">
        <Users size={32} className="text-emerald-600 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">
          User Management
        </span>
      </button>
    </div>
  );
}
