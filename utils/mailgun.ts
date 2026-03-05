interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_FROM = process.env.MAILGUN_FROM_EMAIL || `PeerPull <noreply@${MAILGUN_DOMAIN}>`;

export async function sendNotificationEmail(params: SendEmailParams): Promise<void> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.warn("Mailgun not configured, skipping email");
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("from", MAILGUN_FROM);
    formData.append("to", params.to);
    formData.append("subject", params.subject);
    formData.append("text", params.text);
    if (params.html) {
      formData.append("html", params.html);
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailgun send failed:", response.status, errorText);
    }
  } catch (err) {
    console.error("Mailgun error (non-blocking):", err);
  }
}
