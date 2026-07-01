import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { useListStore } from "@/store/listStore";
import { getProfileHandle, getProfileKey } from "@/lib/identity";
import { formatCompactNumber, formatEngagementRate } from "@/lib/formatters";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { cn } from "@/lib/cn";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index: number;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const key = getProfileKey(profile);
  const handle = getProfileHandle(profile);

  const isSelected = useListStore(useCallback((s) => s.isSelected(key), [key]));
  const toggleProfile = useListStore((s) => s.toggleProfile);

  const handleCardClick = () => {
    navigate(`/profile/${encodeURIComponent(key)}?platform=${platform}`);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProfile(profile, platform);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      role="article"
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer",
        "bg-[var(--bg-card)] transition-all duration-200",
        "hover:border-[var(--border-accent)] hover:shadow-[0_0_24px_var(--accent-glow)]",
        isSelected
          ? "border-[var(--accent)]/40 shadow-[0_0_16px_var(--accent-glow)]"
          : "border-[var(--border)]"
      )}
      aria-label={`View profile for ${profile.fullname} on ${platform}`}
    >
      <PlatformBadge
        platform={platform}
        className="absolute top-3 right-3"
      />

      <Avatar
        src={profile.picture}
        alt={profile.fullname}
        size={52}
        className="ring-2 ring-[var(--border)] group-hover:ring-[var(--accent)]/40 transition-all duration-200"
      />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-[var(--text-h)] truncate text-sm">
            @{handle}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-xs text-[var(--text)] truncate mt-0.5">
          {profile.fullname}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-3 mr-10">
        <div className="text-right">
          <div className="text-xs text-[var(--text)] leading-tight">Followers</div>
          <div className="text-sm font-semibold text-[var(--text-h)]">
            {formatCompactNumber(profile.followers)}
          </div>
        </div>
        {profile.engagement_rate !== undefined && (
          <div className="text-right">
            <div className="text-xs text-[var(--text)] leading-tight">Eng. rate</div>
            <div className="text-sm font-semibold text-[var(--accent)]">
              {formatEngagementRate(profile.engagement_rate)}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleToggle}
        aria-label={isSelected ? `Remove ${handle} from shortlist` : `Add ${handle} to shortlist`}
        aria-pressed={isSelected}
        className={cn(
          "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          isSelected
            ? "bg-[var(--accent-dim)] border-[var(--accent)]/50 text-[var(--accent)]"
            : "bg-transparent border-[var(--border)] text-[var(--text-m)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
        )}
      >
        {isSelected ? "✓ Added" : "+ Add"}
      </button>
    </motion.div>
  );
});
