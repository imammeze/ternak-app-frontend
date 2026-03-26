import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
  placeholder?: string;
  type?: string;
  required?: boolean;
  prefix?: string;
  suffix?: string;
  width?: string;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required = false,
  prefix,
  suffix,
  width = "w-48",
}: FormInputProps) {
  return (
    <div>
      <div
        className={`flex items-center justify-between border ${
          error ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"
        } rounded-xl p-3 shadow-sm relative`}>
        <span className="text-sm text-gray-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
        <div className="flex items-center gap-1">
          {prefix && (
            <span className="text-sm font-medium text-gray-800">{prefix}</span>
          )}
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step={type === "number" ? "0.1" : undefined}
            className={`text-sm font-medium text-gray-800 text-right outline-none bg-transparent ${width}`}
          />
          {suffix && (
            <span className="text-sm font-medium text-gray-800">{suffix}</span>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1 ml-1">{error[0]}</p>}
    </div>
  );
}
