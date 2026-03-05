import { Text, Hr, Section } from "@react-email/components";

interface EmailFooterProps {
  email: string;
}

export function EmailFooter({ email }: EmailFooterProps) {
  return (
    <Section>
      <Hr
        style={{
          borderColor: "#1a1a1a",
          borderWidth: "1px",
          margin: 0,
        }}
      />
      <Text
        style={{
          color: "#555555",
          fontSize: "12px",
          textAlign: "center" as const,
          margin: "32px 0 6px 0",
        }}
      >
        PeerPull &mdash; Feedback exchange for founders
      </Text>
      <Text
        style={{
          color: "#333333",
          fontSize: "11px",
          textAlign: "center" as const,
          margin: "0",
        }}
      >
        Sent to {email}
      </Text>
    </Section>
  );
}
