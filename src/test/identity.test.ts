import { describe, expect, it } from "vitest";
import { getProfileKey, getProfileHandle } from "@/lib/identity";
import type { UserProfileSummary } from "@/types";

const base: Omit<UserProfileSummary, "username" | "handle" | "custom_name"> = {
  user_id: "UCvlE5gTbOvjiolFlEm-c_Ow",
  url: "https://example.com",
  picture: "https://example.com/pic.jpg",
  fullname: "Vlad and Niki",
  is_verified: true,
  followers: 126_000_000,
};

describe("getProfileKey", () => {
  it("returns username when present", () => {
    const profile: UserProfileSummary = { ...base, username: "MrBeast6000" };
    expect(getProfileKey(profile)).toBe("MrBeast6000");
  });

  it("falls back to handle when username is null", () => {
    // This is the actual shape of 3 YouTube accounts in the sample data
    const profile: UserProfileSummary = {
      ...base,
      username: null,
      custom_name: "VladandNiki",
      handle: "VladandNiki",
    };
    expect(getProfileKey(profile)).toBe("VladandNiki");
  });

  it("falls back to custom_name when username and handle are both null", () => {
    const profile: UserProfileSummary = {
      ...base,
      username: null,
      handle: null,
      custom_name: "SomeName",
    };
    expect(getProfileKey(profile)).toBe("SomeName");
  });

  it("falls back to user_id as a last resort (never returns empty string)", () => {
    const profile: UserProfileSummary = {
      ...base,
      username: null,
      handle: null,
      custom_name: null,
    };
    expect(getProfileKey(profile)).toBe("UCvlE5gTbOvjiolFlEm-c_Ow");
  });
});

describe("getProfileHandle", () => {
  it("returns username when present", () => {
    expect(getProfileHandle({ ...base, username: "cristiano" })).toBe("cristiano");
  });

  it("returns handle when username missing", () => {
    expect(
      getProfileHandle({ ...base, username: null, handle: "tseries" })
    ).toBe("tseries");
  });

  it("returns 'unknown' as final fallback", () => {
    expect(
      getProfileHandle({ ...base, username: null, handle: null, custom_name: null })
    ).toBe("unknown");
  });
});
