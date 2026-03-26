import React from "react";
import { LucideIcon } from "lucide-react";

interface IconInputRowProps {
  icon: LucideIcon;
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  width?: string;
  iconColor?: string;
}

export default function IconInputRow({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "0",
  suffix,
  width = "w-12",
  iconColor = "text-emerald-700",
}: IconInputRowProps) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconColor} />
        <span className="text-[15px] text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className={`text-[15px] font-semibold text-gray-800 text-right outline-none bg-transparent ${width}`}
        />
        {suffix && <span className="text-[14px] text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}
