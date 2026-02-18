import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RecordingDemoContent } from "@/components/feedback/RecordingDemoContent";

const DUMMY_PROJECT = {
  name: "TechMate — AI Study Companion",
  description:
    "A mobile app that uses AI to create personalized study plans, flashcards, and practice quizzes from lecture notes and textbooks.",
  url: "https://en.wikipedia.org/wiki/Main_Page",
  submittedBy: "Alex Rivera",
  category: "EdTech / Mobile App",
};

export default async function RecordingDemoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  return <RecordingDemoContent project={DUMMY_PROJECT} />;
}
