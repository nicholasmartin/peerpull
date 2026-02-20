import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitPullRequest } from "@/app/actions";

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

export default function NewRequestPage() {
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
            Requires at least <span className="font-semibold text-yellow-400">2 PeerPoints</span> (charged when a reviewer completes their review, not upfront)
          </p>
        </CardHeader>
        <CardContent>
          <form action={submitPullRequest} className="space-y-6">
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
                placeholder="Tell reviewers what your project does and what kind of feedback you're looking for..."
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
                Specific Questions for Reviewers
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
