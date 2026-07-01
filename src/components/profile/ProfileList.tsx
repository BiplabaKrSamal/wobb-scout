import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        heading="No creators found"
        body="Try a different search term or switch to another platform."
      />
    );
  }

  return (
    <div
      className="grid gap-3"
      role="list"
      aria-label={`${profiles.length} creator${profiles.length !== 1 ? "s" : ""} on ${platform}`}
    >
      {profiles.map((profile, index) => (
        <div key={profile.user_id} role="listitem">
          <ProfileCard
            profile={profile}
            platform={platform}
            index={index}
          />
        </div>
      ))}
    </div>
  );
});
