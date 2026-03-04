interface QualityScoreBadgeProps {
  score: number | null;
  ratedCount?: number;
}

export function QualityScoreBadge({ score, ratedCount }: QualityScoreBadgeProps) {
  if (score == null) {
    return (
      <div className="text-center">
        <span className="text-sm text-gray-500">No score yet</span>
        <p className="text-xs text-gray-600 mt-0.5">Give 3+ feedback to earn a quality score</p>
      </div>
    );
  }

  const colorClass =
    score >= 4.0
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : score >= 3.0
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${colorClass}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {score.toFixed(2)}
      </span>
      {ratedCount != null && (
        <span className="text-xs text-gray-500">Based on {ratedCount} ratings</span>
      )}
    </div>
  );
}
