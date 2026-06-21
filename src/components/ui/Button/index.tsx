// src/components/ui/Button/index.tsx
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white",
  outline: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const showIcon = icon && !loading;

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {showIcon && iconPosition === "left" && icon}
      {children}
      {showIcon && iconPosition === "right" && icon}
    </button>
  );
}
