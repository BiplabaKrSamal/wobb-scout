import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Platform, ProfileDetailResponse } from "@/types";
import {
  formatCompactNumber,
  formatEngagementRate,
  formatExactNumber,
} from "@/lib/formatters";
import { loadProfileByKey } from "@/lib/profileLoader";
import { getProfileHandle } from "@/lib/identity";
import { useListStore } from "@/store/listStore";

type LoadState = "loading" | "loaded" | "not-found";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-chip">
      <span className="stat-chip__label">{label}</span>
      <span className="stat-chip__value">{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-5 items-start">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { key: routeKey } = useParams<{ key: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") ?? "instagram") as Platform;

  // keyed by routeKey so a stale result can never render under the wrong key
  const [result, setResult] = useState<{ key: string; data: ProfileDetailResponse | null } | null>(null);

  useEffect(() => {
    if (!routeKey) return;
    let cancelled = false;

    loadProfileByKey(routeKey).then((data) => {
      if (cancelled) return;
      setResult({ key: routeKey, data });
    });

    return () => { cancelled = true; };
  }, [routeKey]);

  const profileData = result !== null && result.key === routeKey ? result.data : undefined;
  const state: LoadState =
    profileData === undefined ? "loading" : profileData === null ? "not-found" : "loaded";

  const isSelected = useListStore(
    useCallback((s) => {
      if (!routeKey) return false;
      return s.isSelected(routeKey);
    }, [routeKey])
  );
  const toggleProfile = useListStore((s) => s.toggleProfile);

  if (!routeKey) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <p className="text-[var(--text)]">Invalid profile URL.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to search
        </Link>

        {state === "loading" && <DetailSkeleton />}

        {state === "not-found" && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4" aria-hidden>🤷</p>
            <p className="font-semibold text-[var(--text-h)] mb-2">Profile not found</p>
            <p className="text-sm text-[var(--text)] mb-6">
              We don't have a detailed profile for <code className="text-[var(--accent)]">@{routeKey}</code> yet.
            </p>
            <Link to="/" className="text-sm text-[var(--accent)] hover:underline">
              ← Back to search
            </Link>
          </div>
        )}

        {state === "loaded" && profileData && (
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex gap-5 items-start mb-8">
              <Avatar
                src={profileData.data.user_profile.picture}
                alt={profileData.data.user_profile.fullname}
                size={88}
                className="ring-4 ring-[var(--border)]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-[var(--text-h)] m-0">
                    @{getProfileHandle(profileData.data.user_profile)}
                  </h1>
                  <VerifiedBadge verified={profileData.data.user_profile.is_verified} />
                  <PlatformBadge platform={platform} />
                </div>
                <p className="text-sm text-[var(--text-m)]">
                  {profileData.data.user_profile.fullname}
                </p>
                {profileData.data.user_profile.description && (
                  <p className="mt-3 text-sm text-[var(--text)] leading-relaxed line-clamp-4">
                    {profileData.data.user_profile.description}
                  </p>
                )}

                {/* Action row */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Button
                    variant={isSelected ? "outline" : "primary"}
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => toggleProfile(profileData.data.user_profile, platform)}
                  >
                    {isSelected ? "✓ In Shortlist" : "+ Add to Shortlist"}
                  </Button>

                  {profileData.data.user_profile.url && (
                    <a
                      href={profileData.data.user_profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
                      aria-label={`View ${getProfileHandle(profileData.data.user_profile)} on their platform (opens in new tab)`}
                    >
                      View on platform
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <section aria-label="Profile statistics">
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--text)] mb-4">
                Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  label="Followers"
                  value={formatCompactNumber(profileData.data.user_profile.followers)}
                />
                {profileData.data.user_profile.engagement_rate !== undefined && (
                  <StatCard
                    label="Engagement rate"
                    value={formatEngagementRate(profileData.data.user_profile.engagement_rate)}
                  />
                )}
                {profileData.data.user_profile.engagements !== undefined && (
                  <StatCard
                    label="Engagements"
                    value={formatExactNumber(profileData.data.user_profile.engagements)}
                  />
                )}
                {profileData.data.user_profile.posts_count !== undefined && (
                  <StatCard
                    label="Posts"
                    value={formatExactNumber(profileData.data.user_profile.posts_count)}
                  />
                )}
                {profileData.data.user_profile.avg_likes !== undefined && (
                  <StatCard
                    label="Avg. likes"
                    value={formatCompactNumber(profileData.data.user_profile.avg_likes)}
                  />
                )}
                {profileData.data.user_profile.avg_comments !== undefined && (
                  <StatCard
                    label="Avg. comments"
                    value={formatCompactNumber(profileData.data.user_profile.avg_comments)}
                  />
                )}
                {profileData.data.user_profile.avg_views !== undefined &&
                  profileData.data.user_profile.avg_views > 0 && (
                    <StatCard
                      label="Avg. views"
                      value={formatCompactNumber(profileData.data.user_profile.avg_views)}
                    />
                  )}
              </div>
            </section>
          </motion.article>
        )}
      </div>
    </Layout>
  );
}
