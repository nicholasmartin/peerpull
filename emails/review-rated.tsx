import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";
import { EmailButton } from "./_components/email-button";

interface ReviewRatedEmailProps {
  productTitle: string;
  rating: number;
  recipientEmail: string;
  dashboardUrl: string;
}

export default function ReviewRatedEmail({
  productTitle,
  rating,
  recipientEmail,
  dashboardUrl,
}: ReviewRatedEmailProps) {
  return (
    <EmailLayout
      preview={`Your feedback for "${productTitle}" received a ${rating}/5 rating`}
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
          Your Feedback Was Rated
        </Text>
        <Section style={{ textAlign: "center" as const, padding: "0 0 28px 0" }}>
          <Text
            style={{
              color: "#d4a853",
              fontSize: "28px",
              fontWeight: 700,
              margin: "0",
            }}
          >
            {rating}/5
          </Text>
          <Text
            style={{
              color: "#777777",
              fontSize: "13px",
              margin: "4px 0 0 0",
              letterSpacing: "0.3px",
            }}
          >
            rating received
          </Text>
        </Section>
        <Text
          style={{
            color: "#999999",
            fontSize: "15px",
            lineHeight: "1.7",
            margin: "0 0 40px 0",
          }}
        >
          The owner of &ldquo;{productTitle}&rdquo; rated your video feedback{" "}
          {rating} out of 5 stars.
        </Text>
        <Section style={{ textAlign: "center" as const }}>
          <EmailButton href={dashboardUrl}>View Details</EmailButton>
        </Section>
      </Section>
    </EmailLayout>
  );
}
