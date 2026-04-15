import { Filter, XCircle } from "lucide-react";

interface FilterProps {
  filterBulan: string;
  setFilterBulan: (val: string) => void;
  filterTanggal: string;
  setFilterTanggal: (val: string) => void;
}

export default function FilterAbsensi({
  filterBulan,
  setFilterBulan,
  filterTanggal,
  setFilterTanggal,
}: FilterProps) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 mb-2">
      <div className="bg-gray-50 p-2 rounded-xl text-gray-400 shrink-0">
        <Filter size={18} />
      </div>
      <div className="flex-1 flex gap-2">
        <div className="flex-1">
          <input
            type="month"
            value={filterBulan}
            onChange={(e) => {
              setFilterBulan(e.target.value);
              setFilterTanggal("");
            }}
            className="w-full text-[12px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex-1">
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => {
              setFilterTanggal(e.target.value);
              setFilterBulan("");
            }}
            className="w-full text-[12px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      {(filterBulan || filterTanggal) && (
        <button
          onClick={() => {
            setFilterBulan("");
            setFilterTanggal("");
          }}
          className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0">
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
}
