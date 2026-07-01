import { describe, expect, it } from "vitest";
import { filterProfiles } from "@/lib/dataHelpers";
import type { UserProfileSummary } from "@/types";

const profiles: UserProfileSummary[] = [
  {
    user_id: "1",
    username: "cristiano",
    url: "",
    picture: "",
    fullname: "Cristiano Ronaldo",
    is_verified: true,
    followers: 600_000_000,
  },
  {
    user_id: "2",
    username: "leomessi",
    url: "",
    picture: "",
    fullname: "Leo Messi",
    is_verified: true,
    followers: 400_000_000,
  },
  {
    user_id: "3",
    username: null,
    handle: "VladandNiki",
    url: "",
    picture: "",
    fullname: "Vlad and Niki",
    is_verified: true,
    followers: 126_000_000,
  },
];

describe("filterProfiles", () => {
  it("matches username case-insensitively", () => {
    expect(filterProfiles(profiles, "Cristiano")).toHaveLength(1);
    expect(filterProfiles(profiles, "cristiano")).toHaveLength(1);
    expect(filterProfiles(profiles, "CRISTIANO")).toHaveLength(1);
  });

  it("matches fullname case-insensitively", () => {
    expect(filterProfiles(profiles, "messi")).toHaveLength(1);
    expect(filterProfiles(profiles, "Messi")).toHaveLength(1);
  });

  it("returns all profiles for an empty query", () => {
    expect(filterProfiles(profiles, "")).toHaveLength(3);
    expect(filterProfiles(profiles, "  ")).toHaveLength(3);
  });

  it("returns empty array for no match", () => {
    expect(filterProfiles(profiles, "xyznonexistent")).toHaveLength(0);
  });

  it("matches via handle fallback (null-username account)", () => {
    expect(filterProfiles(profiles, "vladandniki")).toHaveLength(1);
    expect(filterProfiles(profiles, "Vlad")).toHaveLength(1);
  });

  it("matches fullname of null-username account", () => {
    expect(filterProfiles(profiles, "vlad and niki")).toHaveLength(1);
  });
});
