import { describe, expect, it, beforeEach } from "vitest";
import { useListStore } from "@/store/listStore";
import type { UserProfileSummary } from "@/types";

const mockProfile: UserProfileSummary = {
  user_id: "25025320",
  username: "instagram",
  url: "https://www.instagram.com/instagram/",
  picture: "https://example.com/ig.jpg",
  fullname: "Instagram",
  is_verified: true,
  followers: 678_000_000,
  engagement_rate: 0.00024,
};

const mockProfile2: UserProfileSummary = {
  user_id: "173560420",
  username: "cristiano",
  url: "https://www.instagram.com/cristiano/",
  picture: "https://example.com/cr7.jpg",
  fullname: "Cristiano Ronaldo",
  is_verified: true,
  followers: 600_000_000,
};

beforeEach(() => {
  useListStore.getState().clearAll();
});

describe("useListStore — addProfile", () => {
  it("adds a profile to the list", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    expect(useListStore.getState().profiles).toHaveLength(1);
    expect(useListStore.getState().profiles[0].username).toBe("instagram");
  });

  it("stores the platform correctly", () => {
    useListStore.getState().addProfile(mockProfile, "youtube");
    expect(useListStore.getState().profiles[0].platform).toBe("youtube");
  });

  it("prevents duplicate entries", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().addProfile(mockProfile, "instagram");
    expect(useListStore.getState().profiles).toHaveLength(1);
  });

  it("can hold multiple distinct profiles", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().addProfile(mockProfile2, "instagram");
    expect(useListStore.getState().profiles).toHaveLength(2);
  });
});

describe("useListStore — removeProfile", () => {
  it("removes a profile by key", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().removeProfile("instagram");
    expect(useListStore.getState().profiles).toHaveLength(0);
  });

  it("is a no-op for a key that doesn't exist", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().removeProfile("nonexistent");
    expect(useListStore.getState().profiles).toHaveLength(1);
  });
});

describe("useListStore — toggleProfile", () => {
  it("adds when not selected", () => {
    useListStore.getState().toggleProfile(mockProfile, "instagram");
    expect(useListStore.getState().profiles).toHaveLength(1);
  });

  it("removes when already selected", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().toggleProfile(mockProfile, "instagram");
    expect(useListStore.getState().profiles).toHaveLength(0);
  });
});

describe("useListStore — isSelected", () => {
  it("returns true for an added profile", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    expect(useListStore.getState().isSelected("instagram")).toBe(true);
  });

  it("returns false before any add", () => {
    expect(useListStore.getState().isSelected("instagram")).toBe(false);
  });
});

describe("useListStore — clearAll", () => {
  it("empties the list", () => {
    useListStore.getState().addProfile(mockProfile, "instagram");
    useListStore.getState().addProfile(mockProfile2, "instagram");
    useListStore.getState().clearAll();
    expect(useListStore.getState().profiles).toHaveLength(0);
  });
});
