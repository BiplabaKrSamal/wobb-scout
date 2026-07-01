import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

// detail json files are named after username/handle, try each candidate in order
export async function loadProfileByKey(
  ...candidates: Array<string | null | undefined>
): Promise<ProfileDetailResponse | null> {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const path = `../assets/data/profiles/${candidate}.json`;
    const loader = profileModules[path];
    if (!loader) continue;

    const result = await loader();
    return ((result as { default?: ProfileDetailResponse }).default ?? result) as ProfileDetailResponse;
  }
  return null;
}
