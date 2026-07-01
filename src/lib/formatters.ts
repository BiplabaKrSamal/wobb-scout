// follower/like counts -> 1.2M, 678K etc. was duplicated 3x across the
// original codebase with different rounding each time, pulled into one place
export function formatCompactNumber(count: number): string {
  if (!Number.isFinite(count)) return "0";
  const abs = Math.abs(count);
  if (abs >= 1_000_000_000) return trimTrailingZero(count / 1_000_000_000) + "B";
  if (abs >= 1_000_000) return trimTrailingZero(count / 1_000_000) + "M";
  if (abs >= 1_000) return trimTrailingZero(count / 1_000) + "K";
  return count.toLocaleString("en-US");
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

// engagement_rate in the json is a fraction (0.000246 = 0.0246%), so *100 not *10000
export function formatEngagementRate(rate: number | undefined | null): string {
  if (rate === undefined || rate === null || !Number.isFinite(rate)) return "—";
  return (rate * 100).toFixed(2) + "%";
}

export function formatExactNumber(count: number | undefined | null): string {
  if (count === undefined || count === null || !Number.isFinite(count)) return "—";
  return count.toLocaleString("en-US");
}
