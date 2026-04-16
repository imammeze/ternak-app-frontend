import { Milk } from "lucide-react";

interface SummaryProps {
  totalLiter: number;
  totalRecord: number;
}

export default function SummarySusu({ totalLiter, totalRecord }: SummaryProps) {
  if (totalRecord === 0) return null;

  return (
    <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border border-emerald-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-xl text-white">
          <Milk size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
            Total Filtered
          </p>
          <p className="text-lg font-black text-emerald-800 leading-none">
            {totalLiter.toFixed(2)} <span className="text-sm font-bold">L</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
          Record
        </p>
        <p className="text-lg font-black text-emerald-800 leading-none">
          {totalRecord} <span className="text-sm font-bold">Data</span>
        </p>
      </div>
    </div>
  );
}
