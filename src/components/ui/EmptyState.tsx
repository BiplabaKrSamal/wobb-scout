interface EmptyStateProps {
  icon?: string;
  heading: string;
  body?: string;
}

export function EmptyState({ icon = "🔍", heading, body }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-20 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="text-4xl select-none" aria-hidden>
        {icon}
      </span>
      <p className="text-base font-medium text-[var(--text-h)]">{heading}</p>
      {body && <p className="text-sm text-[var(--text)] max-w-xs">{body}</p>}
    </div>
  );
}
