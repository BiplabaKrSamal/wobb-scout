import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { SearchControls } from "@/components/profile/SearchControls";
import { ProfileList } from "@/components/profile/ProfileList";
import { extractProfiles, filterProfiles } from "@/lib/dataHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebouncedValue(searchQuery, 180);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filteredProfiles = useMemo(
    () => filterProfiles(allProfiles, debouncedQuery),
    [allProfiles, debouncedQuery]
  );

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setSearchQuery(""); // Clear search when switching platforms
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-3">
            Creator Discovery
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-h)] leading-tight tracking-tight">
            Find the right{" "}
            <span className="text-[var(--accent)]">creators</span>
            <br className="hidden sm:block" /> for your campaign
          </h1>
          <p className="mt-3 text-[var(--text)] text-sm max-w-sm">
            Browse top talent across platforms, compare reach and engagement,
            and build your shortlist — all in one place.
          </p>
        </header>

        <section aria-label="Search and filter">
          <SearchControls
            platform={platform}
            onPlatformChange={handlePlatformChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredProfiles.length}
            totalCount={allProfiles.length}
          />
        </section>

        <section
          id="profile-list"
          className="mt-6"
          aria-label="Creator results"
        >
          <ProfileList
            profiles={filteredProfiles}
            platform={platform}
          />
        </section>
      </div>
    </Layout>
  );
}
