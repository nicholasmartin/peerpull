"use client";

import { Button } from "@/components/ui/button";

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

type FeedbackRequestFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    id?: string;
    title?: string;
    url?: string | null;
    description?: string | null;
    stage?: string | null;
    categories?: string[] | null;
    focus_areas?: string[] | null;
    questions?: string[] | null;
  };
  submitLabel: string;
  showPublishButton?: boolean;
  publishAction?: (formData: FormData) => void;
  restrictedFields?: string[];
};

export function FeedbackRequestForm({
  action,
  defaultValues,
  submitLabel,
  showPublishButton,
  publishAction,
  restrictedFields = [],
}: FeedbackRequestFormProps) {
  const isRestricted = (field: string) => restrictedFields.includes(field);
  const restrictedClass = "opacity-50 cursor-not-allowed";
  const inputClass = "w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

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
          disabled={isRestricted("title")}
          defaultValue={defaultValues?.title || ""}
          className={`${inputClass} ${isRestricted("title") ? restrictedClass : ""}`}
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
          disabled={isRestricted("url")}
          defaultValue={defaultValues?.url || ""}
          className={`${inputClass} ${isRestricted("url") ? restrictedClass : ""}`}
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
          defaultValue={defaultValues?.description || ""}
          className={inputClass}
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
          disabled={isRestricted("stage")}
          defaultValue={defaultValues?.stage || ""}
          className={`${inputClass} ${isRestricted("stage") ? restrictedClass : ""}`}
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
        <div className={`grid grid-cols-2 gap-2 ${isRestricted("categories") ? restrictedClass : ""}`}>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="categories"
                value={cat}
                disabled={isRestricted("categories")}
                defaultChecked={defaultValues?.categories?.includes(cat) || false}
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
                defaultChecked={defaultValues?.focus_areas?.includes(area) || false}
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
            defaultValue={defaultValues?.questions?.[n - 1] || ""}
            className={inputClass}
            placeholder={`Question ${n} (optional)`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
        {showPublishButton && publishAction && (
          <Button
            type="submit"
            formAction={publishAction}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Publish
          </Button>
        )}
      </div>
    </form>
  );
}
