import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181c] focus:ring-brand-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-white text-[#050507] hover:bg-[#E2E8F0] active:scale-[0.98] shadow-lg shadow-white/10 font-bold focus:ring-white/30 border border-transparent transition-all",
    secondary: "bg-white/[0.06] border border-white/10 text-white hover:bg-white/12 hover:border-white/20 focus:ring-white/20",
    outline: "border border-white/15 bg-transparent text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/20",
    ghost: "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white focus:ring-white/10",
    danger: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500/50 shadow-lg shadow-rose-950/20",
    gradient: "bg-white text-[#050507] hover:bg-[#E2E8F0] active:scale-[0.98] shadow-lg shadow-white/10 font-bold focus:ring-white/30 border border-transparent transition-all",
  };

  const sizes = {
    sm: "px-3.5 py-2 text-xs gap-1.5",
    md: "px-5 py-3 text-sm gap-2",
    lg: "px-7 py-4 text-base gap-2.5 rounded-2xl",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
