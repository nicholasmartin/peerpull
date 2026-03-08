import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";
import { EmailButton } from "./_components/email-button";

interface ReviewRejectedEmailProps {
  productTitle: string;
  recipientEmail: string;
  dashboardUrl: string;
}

export default function ReviewRejectedEmail({
  productTitle,
  recipientEmail,
  dashboardUrl,
}: ReviewRejectedEmailProps) {
  return (
    <EmailLayout
      preview={`Update on your feedback for "${productTitle}"`}
      email={recipientEmail}
    >
      <Section style={{ padding: "48px 0 40px 0" }}>
        <Text
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 600,
            margin: "0 0 28px 0",
            lineHeight: "1.3",
          }}
        >
          Feedback Update
        </Text>
        <Text
          style={{
            color: "#999999",
            fontSize: "15px",
            lineHeight: "1.7",
            margin: "0 0 40px 0",
          }}
        >
          Your video feedback for &ldquo;{productTitle}&rdquo; was marked as
          unhelpful by the project owner. Don&apos;t be discouraged. You can
          continue providing feedback on other projects to earn PeerPoints.
        </Text>
        <Section style={{ textAlign: "center" as const }}>
          <EmailButton href={dashboardUrl}>Browse Projects</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  );
}
