import { QualityScoreBadge } from "./QualityScoreBadge";

interface BuilderStats {
  projectsSubmitted: number;
  reviewsReceived: number;
  avgRatingReceived: number | null;
  signalsReceived: { follow: number; engage: number; invest: number };
}

interface ReviewerStats {
  reviewsGiven: number;
  qualityScore: number | null;
  avgRatingGiven: number | null;
  approvalRate: number | null;
}

interface ProfileStatsProps {
  builderStats: BuilderStats;
  reviewerStats: ReviewerStats;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function formatRating(avg: number | null): string {
  if (avg == null) return "—";
  return `${avg.toFixed(1)} / 5`;
}

function formatPercent(rate: number | null): string {
  if (rate == null) return "—";
  return `${Math.round(rate * 100)}%`;
}

export function ProfileStats({ builderStats, reviewerStats }: ProfileStatsProps) {
  const { signalsReceived } = builderStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Builder stats */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">As a Builder</h3>
        <div className="divide-y divide-dark-border">
          <StatRow label="Projects Submitted" value={builderStats.projectsSubmitted} />
          <StatRow label="Reviews Received" value={builderStats.reviewsReceived} />
          <StatRow label="Avg Rating Received" value={formatRating(builderStats.avgRatingReceived)} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-gray-400">Interest Signals</span>
            <span className="text-sm text-white">
              {signalsReceived.follow > 0 || signalsReceived.engage > 0 || signalsReceived.invest > 0 ? (
                <span className="flex gap-2 text-xs">
                  {signalsReceived.follow > 0 && <span style={{ color: "#0070dd" }}>{signalsReceived.follow} follow</span>}
                  {signalsReceived.engage > 0 && <span style={{ color: "#a335ee" }}>{signalsReceived.engage} engage</span>}
                  {signalsReceived.invest > 0 && <span style={{ color: "#ff8000" }}>{signalsReceived.invest} invest</span>}
                </span>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Reviewer stats */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">As a Reviewer</h3>
        <div className="divide-y divide-dark-border">
          <StatRow label="Reviews Given" value={reviewerStats.reviewsGiven} />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-gray-400">Quality Score</span>
            <QualityScoreBadge score={reviewerStats.qualityScore} />
          </div>
          <StatRow label="Avg Rating Given" value={formatRating(reviewerStats.avgRatingGiven)} />
          <StatRow label="Approval Rate" value={formatPercent(reviewerStats.approvalRate)} />
        </div>
      </div>
    </div>
  );
}
