import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";
import { EmailButton } from "./_components/email-button";

interface ReviewReceivedEmailProps {
  productTitle: string;
  recipientEmail: string;
  dashboardUrl: string;
}

export default function ReviewReceivedEmail({
  productTitle,
  recipientEmail,
  dashboardUrl,
}: ReviewReceivedEmailProps) {
  return (
    <EmailLayout
      preview={`New feedback received for "${productTitle}"`}
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
          New Feedback Received
        </Text>
        <Text
          style={{
            color: "#999999",
            fontSize: "15px",
            lineHeight: "1.7",
            margin: "0 0 40px 0",
          }}
        >
          Someone submitted video feedback for &ldquo;{productTitle}&rdquo;.
          Head to your dashboard to watch it and leave a rating.
        </Text>
        <Section style={{ textAlign: "center" as const }}>
          <EmailButton href={dashboardUrl}>View Feedback</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  );
}
