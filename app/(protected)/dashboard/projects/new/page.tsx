import Link from "next/link";
import { ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitFeedbackRequest } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { getUserProfile } from "@/utils/supabase/profiles";
import { redirect } from "next/navigation";
import { FeedbackRequestForm } from "@/components/protected/dashboard/FeedbackRequestForm";

export default async function NewProjectPage() {
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
            Projects will be available when the platform launches.
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
          <Link href="/dashboard/projects/list">
            <Button className="bg-primary hover:bg-primary-muted">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/projects/list"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Projects
      </Link>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">New Project</CardTitle>
          <p className="text-sm text-gray-400">
            Requires at least <span className="font-semibold text-yellow-400">2 PeerPoints</span> (charged when someone gives you feedback, not upfront)
          </p>
        </CardHeader>
        <CardContent>
          <FeedbackRequestForm
            action={submitFeedbackRequest}
            submitLabel="Submit Project"
          />
        </CardContent>
      </Card>
    </div>
  );
}
