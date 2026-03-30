import type { ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  error?: string;
  inputClassName?: string;
}

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
  inputClassName = "",
  helperText,
  error,
  ...props
}: InputProps) {
  return (
    <div dir="rtl" className={`w-full ${className}`}>
      {label ? (
        <label htmlFor={name} className="mb-2 mr-1 block text-sm font-semibold text-slate-100">
          {label}
        </label>
      ) : null}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border px-3 text-yellow-50 placeholder:text-yellow-100/60 bg-black/35 backdrop-blur-sm ${error ? "border-rose-300/70" : "border-yellow-300/25 hover:border-yellow-300/45"} ${inputClassName}`}
        {...props}
      />

      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
      {!error && helperText ? <p className="mt-1 text-xs text-slate-300/70">{helperText}</p> : null}
    </div>
  );
}
