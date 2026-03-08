import { redirect } from "next/navigation";

export default function LegacyNewRequestPage() {
  redirect("/dashboard/projects/new");
}
