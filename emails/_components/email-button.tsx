import { Button } from "@react-email/components";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: "#d4a853",
        color: "#0a0a0a",
        textDecoration: "none",
        padding: "14px 40px",
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "14px",
        letterSpacing: "0.3px",
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </Button>
  );
}
