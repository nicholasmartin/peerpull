import { createClient } from "@/utils/supabase/server";
import { sendNotificationEmail } from "@/utils/mailgun";
import { render } from "@react-email/components";
import ReviewReceivedEmail from "@/emails/review-received";
import ReviewApprovedEmail from "@/emails/review-approved";
import ReviewRejectedEmail from "@/emails/review-rejected";
import ReviewRatedEmail from "@/emails/review-rated";

export type NotificationType =
  | "review_received"
  | "review_approved"
  | "review_rejected"
  | "review_rated";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  referenceId?: string;
  productTitle?: string;
  rating?: number;
  linkUrl?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    const supabase = await createClient();

    // 1. Insert notification via SECURITY DEFINER RPC
    const { error: rpcError } = await supabase.rpc("create_notification", {
      p_user_id: params.userId,
      p_type: params.type,
      p_title: params.title,
      p_message: params.message || null,
      p_reference_id: params.referenceId || null,
      p_link_url: params.linkUrl || null,
    });

    if (rpcError) {
      console.error("Failed to create notification:", rpcError.message);
      return;
    }

    // 2. Check email preference (no row = email_enabled true by default)
    const { data: pref } = await supabase
      .from("notification_preferences")
      .select("email_enabled")
      .eq("user_id", params.userId)
      .eq("event_type", params.type)
      .maybeSingle();

    const emailEnabled = pref?.email_enabled ?? true;
    if (!emailEnabled) return;

    // 3. Get recipient email via SECURITY DEFINER RPC
    const { data: email } = await supabase.rpc("get_user_email", {
      p_user_id: params.userId,
    });

    if (email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peerpull.com";
      const dashboardUrl = `${appUrl}/dashboard`;
      const recipientEmail = email as string;

      let html: string | undefined;
      try {
        switch (params.type) {
          case "review_received":
            html = await render(
              <ReviewReceivedEmail
                productTitle={params.productTitle || "your project"}
                recipientEmail={recipientEmail}
                dashboardUrl={dashboardUrl}
              />
            );
            break;
          case "review_approved":
            html = await render(
              <ReviewApprovedEmail
                productTitle={params.productTitle || "your project"}
                recipientEmail={recipientEmail}
                dashboardUrl={`${appUrl}/dashboard/peerpoints`}
              />
            );
            break;
          case "review_rejected":
            html = await render(
              <ReviewRejectedEmail
                productTitle={params.productTitle || "your project"}
                recipientEmail={recipientEmail}
                dashboardUrl={`${appUrl}/dashboard/submit-feedback`}
              />
            );
            break;
          case "review_rated":
            html = await render(
              <ReviewRatedEmail
                productTitle={params.productTitle || "your project"}
                rating={params.rating || 0}
                recipientEmail={recipientEmail}
                dashboardUrl={dashboardUrl}
              />
            );
            break;
        }
      } catch (renderErr) {
        console.error("Email template render error (non-blocking):", renderErr);
      }

      await sendNotificationEmail({
        to: recipientEmail,
        subject: params.title,
        text: params.message || params.title,
        html,
      });
    }
  } catch (err) {
    console.error("Notification error (non-blocking):", err);
  }
}
