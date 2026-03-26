import React from "react";
import { ChevronRight } from "lucide-react";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: FormSelectProps) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 relative bg-white shadow-sm">
      <span className="text-sm text-gray-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none bg-transparent text-sm text-center font-medium text-gray-800 outline-none cursor-pointer z-10 w-40">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronRight size={16} className="text-gray-400 absolute right-3" />
    </div>
  );
}
