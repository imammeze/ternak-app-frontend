import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";

interface IconSelectRowProps {
  icon: LucideIcon;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  iconColor?: string;
}

export default function IconSelectRow({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  iconColor = "text-gray-400",
}: IconSelectRowProps) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative">
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconColor} />
        <span className="text-[15px] text-gray-700 font-medium">{label}</span>
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none bg-transparent text-[15px] font-medium text-gray-800 text-right pr-6 outline-none cursor-pointer z-10 w-48 truncate">
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronRight size={16} className="text-gray-400 absolute right-3" />
    </div>
  );
}
