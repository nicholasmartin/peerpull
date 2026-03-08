import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 rounded-md" />
        <Skeleton className="h-20 rounded-md" />
        <Skeleton className="h-20 rounded-md" />
      </div>
      <div className="rounded-md border border-dark-border bg-dark-card">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
