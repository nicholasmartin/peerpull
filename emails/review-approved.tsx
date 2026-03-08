import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";
import { EmailButton } from "./_components/email-button";

interface ReviewApprovedEmailProps {
  productTitle: string;
  recipientEmail: string;
  dashboardUrl: string;
}

export default function ReviewApprovedEmail({
  productTitle,
  recipientEmail,
  dashboardUrl,
}: ReviewApprovedEmailProps) {
  return (
    <EmailLayout
      preview={`Your feedback for "${productTitle}" was marked helpful!`}
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
          Feedback Marked Helpful!
        </Text>
        <Text
          style={{
            color: "#999999",
            fontSize: "15px",
            lineHeight: "1.7",
            margin: "0 0 40px 0",
          }}
        >
          Great news! Your video feedback for &ldquo;{productTitle}&rdquo; was
          marked as helpful by the project owner.
        </Text>
        <Section style={{ textAlign: "center" as const }}>
          <EmailButton href={dashboardUrl}>View Your PeerPoints</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  );
}
