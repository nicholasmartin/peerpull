import { redirect } from "next/navigation";

export default function LegacySubmitFeedbackPage() {
  redirect("/dashboard/feedback/submit");
}
