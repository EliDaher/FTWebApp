// components/ui/Input.tsx

import React from "react";

interface InputProps {
  label?: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
  required
}) => {
  return (
    <div dir="rtl" className={`mb-1 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block font-medium mb-1 mr-2">
          {label}
        </label>
      )}
      <input
        required={required}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-white p-2 rounded text-white placeholder-white/70 bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
      />
    </div>
  );
};

export default Input;
