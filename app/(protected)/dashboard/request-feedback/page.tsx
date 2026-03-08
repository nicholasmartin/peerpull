import { redirect } from "next/navigation";

export default function LegacyRequestFeedbackPage() {
  redirect("/dashboard/projects/list");
}
