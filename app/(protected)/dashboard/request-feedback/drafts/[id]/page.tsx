import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DraftFeedbackRequestPage({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/request-feedback/${id}/edit`);
}
