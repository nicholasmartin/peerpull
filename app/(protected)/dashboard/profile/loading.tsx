import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-dark-border bg-dark-card p-3 text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-md" />
          ))}
        </div>
        <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
