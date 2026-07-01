import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useListStore } from "@/store/listStore";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCompactNumber } from "@/lib/formatters";
import type { SavedProfile } from "@/types";

interface ShortlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

function ShortlistRow({
  profile,
  onRemove,
  onNavigate,
}: {
  profile: SavedProfile;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] group"
    >
      <button
        onClick={onNavigate}
        className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
        aria-label={`Go to ${profile.fullname}'s profile`}
      >
        <Avatar src={profile.picture} alt={profile.fullname} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-h)] truncate">
              @{profile.username}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <PlatformBadge platform={profile.platform} />
            <span className="text-xs text-[var(--text)]">
              {formatCompactNumber(profile.followers)} followers
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={onRemove}
        aria-label={`Remove ${profile.username} from shortlist`}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shrink-0 p-1.5 rounded-lg text-[var(--text)] hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 cursor-pointer"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  );
}

export function ShortlistDrawer({ open, onClose }: ShortlistDrawerProps) {
  const profiles = useListStore((s) => s.profiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearAll = useListStore((s) => s.clearAll);
  const navigate = useNavigate();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Trap focus back to close button when opened; restore on close
  useEffect(() => {
    if (open) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNavigate = (profile: SavedProfile) => {
    navigate(`/profile/${encodeURIComponent(profile.key)}?platform=${profile.platform}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-[var(--bg-elevated)] border-l border-[var(--border)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div>
                <h2
                  id={titleId}
                  className="text-base font-semibold text-[var(--text-h)]"
                >
                  My Shortlist
                </h2>
                <p className="text-xs text-[var(--text)] mt-0.5">
                  {profiles.length === 0
                    ? "No creators added yet"
                    : `${profiles.length} creator${profiles.length !== 1 ? "s" : ""} selected`}
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close shortlist"
                className="p-2 rounded-lg text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {profiles.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EmptyState
                      icon="📋"
                      heading="Your shortlist is empty"
                      body='Hit "+ Add" on any creator card to add them here.'
                    />
                  </motion.div>
                ) : (
                  profiles.map((profile) => (
                    <ShortlistRow
                      key={profile.key}
                      profile={profile}
                      onRemove={() => removeProfile(profile.key)}
                      onNavigate={() => handleNavigate(profile)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            {profiles.length > 0 && (
              <div className="px-4 py-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Remove all ${profiles.length} creators from your shortlist?`)) {
                      clearAll();
                    }
                  }}
                >
                  Clear all
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                >
                  Done
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
