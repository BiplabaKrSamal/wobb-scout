import { useId } from "react";
import type { Platform } from "@/types";
import { PLATFORMS, PLATFORM_LABELS } from "@/lib/dataHelpers";
import { cn } from "@/lib/cn";

interface SearchControlsProps {
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  resultCount: number;
  totalCount: number;
}

const PLATFORM_ICONS: Record<Platform, string> = {
  instagram: "IG",
  youtube: "YT",
  tiktok: "TT",
};

export function SearchControls({
  platform,
  onPlatformChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: SearchControlsProps) {
  const inputId = useId();

  return (
    <div className="space-y-4">
      {/* Platform tabs */}
      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Filter by platform"
      >
        {PLATFORMS.map((p) => {
          const active = p === platform;
          return (
            <button
              key={p}
              role="tab"
              aria-selected={active}
              aria-controls="profile-list"
              onClick={() => onPlatformChange(p)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                active
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
                  : "bg-[var(--bg-card)] text-[var(--text-m)] border-[var(--border)] hover:border-[var(--border-accent)] hover:text-[var(--text-h)]"
              )}
            >
              <span className="text-xs font-bold opacity-60">
                {PLATFORM_ICONS[p]}
              </span>
              {PLATFORM_LABELS[p]}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Search creators by name or handle
        </label>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] pointer-events-none"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          id={inputId}
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by @handle or name…"
          className="w-full pl-9 pr-4 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          aria-label="Search creators"
          autoComplete="off"
          spellCheck={false}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-[var(--text-h)] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Result count status */}
      <p
        className="text-xs text-[var(--text)]"
        aria-live="polite"
        aria-atomic="true"
      >
        {searchQuery
          ? `${resultCount} of ${totalCount} creators match "${searchQuery}"`
          : `${totalCount} creators on ${PLATFORM_LABELS[platform]}`}
      </p>
    </div>
  );
}
