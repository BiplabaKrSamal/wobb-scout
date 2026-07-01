import { cn } from "@/lib/cn";
import type { Platform } from "@/types";

const CONFIG: Record<Platform, { label: string; color: string; bg: string }> = {
  instagram: {
    label: "IG",
    color: "text-[#e1306c]",
    bg: "bg-[rgba(225,48,108,0.12)] border-[rgba(225,48,108,0.25)]",
  },
  youtube: {
    label: "YT",
    color: "text-[#ff4444]",
    bg: "bg-[rgba(255,68,68,0.12)] border-[rgba(255,68,68,0.25)]",
  },
  tiktok: {
    label: "TT",
    color: "text-[#69c9d0]",
    bg: "bg-[rgba(105,201,208,0.12)] border-[rgba(105,201,208,0.25)]",
  },
};

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const cfg = CONFIG[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest border",
        cfg.color,
        cfg.bg,
        className
      )}
      aria-label={
        platform === "instagram"
          ? "Instagram"
          : platform === "youtube"
            ? "YouTube"
            : "TikTok"
      }
    >
      {cfg.label}
    </span>
  );
}
