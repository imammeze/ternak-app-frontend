import { Home, Clock, QrCode, FileText, User } from "lucide-react";

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 max-w-md z-9999 w-full bg-white flex justify-between items-end px-6 py-4 rounded-t-[30px] shadow-[0_-10px_40px_rgb(0,0,0,0.08)]">
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <Home size={24} className="text-emerald-600" />
        <span className="text-[10px] text-emerald-600 font-medium">Home</span>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <Clock size={24} className="text-gray-400" />
        <span className="text-[10px] text-gray-400 font-medium">Activity</span>
      </div>
      <div className="relative -top-6 flex flex-col items-center cursor-pointer">
        <div className="bg-emerald-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 text-white transform rotate-45 hover:scale-105 transition-transform">
          <QrCode size={26} className="-rotate-45" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <FileText size={24} className="text-gray-400" />
        <span className="text-[10px] text-gray-400 font-medium">Report</span>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <User size={24} className="text-gray-400" />
        <span className="text-[10px] text-gray-400 font-medium">Profile</span>
      </div>
    </div>
  );
}
