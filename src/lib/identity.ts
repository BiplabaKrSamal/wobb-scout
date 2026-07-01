import type { UserProfileSummary } from "@/types";

// a few youtube accounts in the sample data have username: null and only
// carry handle/custom_name — this was breaking the /profile/:username route
export function getProfileKey(profile: UserProfileSummary): string {
  return profile.username || profile.handle || profile.custom_name || profile.user_id;
}

export function getProfileHandle(profile: UserProfileSummary): string {
  return profile.username || profile.handle || profile.custom_name || "unknown";
}
