import { Text, Hr, Section } from "@react-email/components";

export function EmailHeader() {
  return (
    <Section>
      <Text
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.5px",
          textAlign: "center" as const,
          padding: "0 0 40px 0",
          margin: 0,
        }}
      >
        PeerPull
      </Text>
      <Hr
        style={{
          borderColor: "#d4a853",
          borderWidth: "1px",
          margin: 0,
        }}
      />
    </Section>
  );
}
