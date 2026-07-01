export type Platform = "instagram" | "youtube" | "tiktok";

// username can be null on some youtube accounts in the sample data,
// use getProfileKey() / getProfileHandle() instead of reading .username directly
export interface UserProfileSummary {
  user_id: string;
  username?: string | null;
  handle?: string | null;
  custom_name?: string | null;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

export interface SavedProfile {
  key: string;
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  platform: Platform;
  is_verified: boolean;
  followers: number;
  addedAt: number;
}
