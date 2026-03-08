import { Skeleton } from "@/components/ui/skeleton"

export default function FeedbackLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      <div className="rounded-md border border-dark-border bg-dark-card p-8 space-y-4">
        <Skeleton className="h-5 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-md mx-auto" />
          ))}
        </div>
        <Skeleton className="h-12 w-48 rounded-md mx-auto mt-4" />
      </div>
    </div>
  )
}
