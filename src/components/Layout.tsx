import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/listStore";
import { ShortlistDrawer } from "@/components/list/ShortlistDrawer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const count = useListStore((s) => s.profiles.length);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col min-h-svh">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 h-14 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-h)] hover:text-[var(--accent)] transition-colors"
            aria-label="Wobb — go to search"
          >
            <span className="text-[var(--accent)] font-black tracking-tighter text-lg leading-none">
              W
            </span>
            <span className="hidden sm:inline">Wobb Scout</span>
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-m)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 cursor-pointer"
            aria-label={`Open shortlist — ${count} profile${count !== 1 ? "s" : ""} selected`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M2 4h12M2 8h9M2 12h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">My Shortlist</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold shadow-[0_0_8px_var(--accent-glow)]">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <ShortlistDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
