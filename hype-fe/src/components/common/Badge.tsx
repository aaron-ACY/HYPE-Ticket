import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "glow";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full uppercase tracking-wider select-none";
  
  const variants = {
    primary: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
    secondary: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    glow: "bg-brand-primary text-white shadow-[0_0_12px_rgba(217,70,239,0.4)] border border-brand-primary/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
