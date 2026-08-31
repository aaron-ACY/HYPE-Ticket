import React, { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, leftIcon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left leading-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-zinc-550 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none appearance-none cursor-pointer focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/10 ${
              leftIcon ? "pl-11" : ""
            } ${
              error ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/10" : ""
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3.5 pointer-events-none text-zinc-400">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-rose-500 font-medium pl-1 text-left">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
