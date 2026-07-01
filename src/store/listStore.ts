import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, SavedProfile, UserProfileSummary } from "@/types";
import { getProfileHandle, getProfileKey } from "@/lib/identity";

interface ListState {
  profiles: SavedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (key: string) => void;
  toggleProfile: (profile: UserProfileSummary, platform: Platform) => void;
  clearAll: () => void;
  isSelected: (key: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile, platform) => {
        const key = getProfileKey(profile);
        if (get().profiles.some((p) => p.key === key)) return;

        const saved: SavedProfile = {
          key,
          user_id: profile.user_id,
          username: getProfileHandle(profile),
          fullname: profile.fullname,
          picture: profile.picture,
          platform,
          is_verified: profile.is_verified,
          followers: profile.followers,
          addedAt: Date.now(),
        };

        set({ profiles: [...get().profiles, saved] });
      },

      removeProfile: (key) => {
        set({ profiles: get().profiles.filter((p) => p.key !== key) });
      },

      toggleProfile: (profile, platform) => {
        const key = getProfileKey(profile);
        if (get().profiles.some((p) => p.key === key)) {
          get().removeProfile(key);
        } else {
          get().addProfile(profile, platform);
        }
      },

      clearAll: () => set({ profiles: [] }),

      isSelected: (key) => get().profiles.some((p) => p.key === key),
    }),
    { name: "wobb-shortlist", version: 1 }
  )
);
