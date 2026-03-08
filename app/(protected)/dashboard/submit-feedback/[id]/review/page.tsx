import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyReviewPage({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/feedback/${id}/review`);
}
