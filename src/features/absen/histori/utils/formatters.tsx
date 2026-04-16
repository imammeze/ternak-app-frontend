import { LogIn, LogOut, Clock, TimerOff, AlignJustify } from "lucide-react";

export const getStyleByType = (tipe: string) => {
  switch (tipe) {
    case "Masuk":
      return {
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        indicator: "bg-emerald-400",
        icon: LogIn,
      };
    case "Keluar":
      return {
        color: "text-rose-500",
        bg: "bg-rose-50",
        indicator: "bg-rose-400",
        icon: LogOut,
      };
    case "Mulai Menginap":
      return {
        color: "text-purple-500",
        bg: "bg-purple-50",
        indicator: "bg-purple-400",
        icon: Clock,
      };
    case "Selesai Menginap":
      return {
        color: "text-orange-500",
        bg: "bg-orange-50",
        indicator: "bg-orange-400",
        icon: TimerOff,
      };
    default:
      return {
        color: "text-gray-500",
        bg: "bg-gray-50",
        indicator: "bg-gray-400",
        icon: AlignJustify,
      };
  }
};

export const formatTanggal = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatJam = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
