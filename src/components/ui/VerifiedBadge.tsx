interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold ml-1 shrink-0"
      role="img"
      aria-label="Verified account"
      title="Verified account"
    >
      ✓
    </span>
  );
}
