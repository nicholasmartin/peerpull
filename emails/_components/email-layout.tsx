import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Tailwind,
} from "@react-email/components";
import { pixelBasedPreset } from "@react-email/components";
import { EmailHeader } from "./email-header";
import { EmailFooter } from "./email-footer";

interface EmailLayoutProps {
  preview: string;
  email: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, email, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#d4a853",
                "brand-bg": "#050505",
                "brand-card": "#0a0a0b",
                "brand-divider": "#1a1a1a",
              },
            },
          },
        }}
      >
        <Body
          style={{
            margin: 0,
            padding: 0,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            backgroundColor: "#050505",
            color: "#e5e5e5",
          }}
        >
          <Container
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              padding: "48px 20px",
            }}
          >
            <EmailHeader />
            {children}
            <EmailFooter email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
