import Link from "next/link";
import { ArrowLeft, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackRequestForm } from "@/components/protected/dashboard/FeedbackRequestForm";
import { updateFeedbackRequest, publishDraftFeedbackRequest } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: pr } = await supabase
    .from("feedback_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!pr) return redirect("/dashboard/projects/list");

  if (pr.user_id !== user.id) {
    return redirect("/dashboard/projects/list");
  }

  const editableStatuses = ["draft", "open", "in_review"];
  if (!editableStatuses.includes(pr.status)) {
    return redirect(`/dashboard/projects/${id}`);
  }

  const isDraft = pr.status === "draft";
  const isInReview = pr.status === "in_review";

  const defaultValues = {
    id: pr.id,
    title: pr.title,
    url: pr.url,
    description: pr.description,
    stage: pr.stage,
    categories: pr.categories,
    focus_areas: pr.focus_areas,
    questions: pr.questions,
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/dashboard/projects/${id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project
      </Link>

      {isDraft && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <Info className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-sm text-yellow-200">
            This is a draft. Publish it to start receiving feedback.
          </p>
        </div>
      )}

      {isInReview && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-200">
            This project is currently being reviewed. Only description, focus areas, and questions can be edited.
          </p>
        </div>
      )}

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">
            {isDraft ? "Edit Draft" : "Edit Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackRequestForm
            action={updateFeedbackRequest}
            defaultValues={defaultValues}
            submitLabel={isDraft ? "Save Draft" : "Save Changes"}
            showPublishButton={isDraft}
            publishAction={isDraft ? publishDraftFeedbackRequest : undefined}
            restrictedFields={isInReview ? ["title", "url", "stage", "categories"] : []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
