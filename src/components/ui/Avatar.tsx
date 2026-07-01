import { useState } from "react";
import { cn } from "@/lib/cn";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);

  const initials = alt
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (errored) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--text-m)] font-semibold shrink-0 select-none",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-label={alt}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn("rounded-full object-cover shrink-0", className)}
      style={{ width: size, height: size }}
      onError={() => setErrored(true)}
    />
  );
}
