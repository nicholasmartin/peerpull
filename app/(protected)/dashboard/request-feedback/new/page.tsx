import Link from "next/link";
import { ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitFeedbackRequest } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { getUserProfile } from "@/utils/supabase/profiles";
import { redirect } from "next/navigation";

const CATEGORIES = [
  "Web App",
  "Mobile App",
  "API",
  "Design",
  "Landing Page",
  "CLI Tool",
  "Library",
  "Other",
];

const FOCUS_AREAS = [
  "UX/UI",
  "Code Quality",
  "Performance",
  "Security",
  "Accessibility",
  "Business Model",
  "Copy/Content",
  "Architecture",
];

const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Launched" },
];

export default async function NewRequestPage() {
  // Server-side limit gate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);
  const settings = await getSettings();
  const isActive = profile?.status === 'active' || settings.platform_launched;

  if (!isActive) {
    return (
      <div className="mx-auto max-w-md mt-16 text-center">
        <div className="rounded-xl border border-dark-border bg-dark-card p-8">
          <Lock className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text mb-3">Coming Soon</h2>
          <p className="text-dark-text-muted mb-6">
            Feedback requests will be available when the platform launches.
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary-muted">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { count: activeCount } = await supabase
    .from("feedback_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open")
    .not("queue_position", "is", null);

  if ((activeCount ?? 0) >= settings.active_project_limit) {
    return (
      <div className="mx-auto max-w-md mt-16 text-center">
        <div className="rounded-xl border border-dark-border bg-dark-card p-8">
          <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text mb-3">Active Project Limit Reached</h2>
          <p className="text-gray-400 mb-6">
            You can only have {settings.active_project_limit} active project{settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time.
            Complete or remove an existing project to submit a new one.
          </p>
          <Link href="/dashboard/request-feedback">
            <Button className="bg-primary hover:bg-primary-muted">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Requests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/request-feedback"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Request Feedback
      </Link>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">New Request for Feedback</CardTitle>
          <p className="text-sm text-gray-400">
            Requires at least <span className="font-semibold text-yellow-400">2 PeerPoints</span> (charged when someone gives you feedback, not upfront)
          </p>
        </CardHeader>
        <CardContent>
          <form action={submitFeedbackRequest} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="My Awesome Project"
              />
            </div>

            {/* Project URL */}
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                Project URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tell others what your project does and what feedback you're looking for..."
              />
            </div>

            {/* Project Stage */}
            <div className="space-y-2">
              <label htmlFor="stage" className="block text-sm font-medium text-gray-300">
                Project Stage
              </label>
              <select
                id="stage"
                name="stage"
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a stage</option>
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-300">Categories</span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat}
                      className="rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-300">Focus Areas</span>
              <div className="grid grid-cols-2 gap-2">
                {FOCUS_AREAS.map((area) => (
                  <label key={area} className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      name="focus_areas"
                      value={area}
                      className="rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500"
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            {/* Specific Questions */}
            <div className="space-y-3">
              <span className="block text-sm font-medium text-gray-300">
                Specific Questions for Feedback Givers
              </span>
              {[1, 2, 3].map((n) => (
                <input
                  key={n}
                  name={`question${n}`}
                  type="text"
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Question ${n} (optional)`}
                />
              ))}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
