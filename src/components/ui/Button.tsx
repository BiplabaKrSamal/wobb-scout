import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md";
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-[var(--accent)] text-white hover:brightness-110 active:brightness-90 shadow-[0_0_16px_var(--accent-glow)]",
  ghost:
    "bg-transparent text-[var(--text-m)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-h)]",
  outline:
    "bg-transparent border border-[var(--border)] text-[var(--text-m)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  destructive:
    "bg-transparent text-red-400 hover:bg-red-400/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs h-8",
  md: "px-4 py-2 text-sm h-9",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
