import { createClient } from "@/utils/supabase/server";
import { sendNotificationEmail } from "@/utils/mailgun";

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
      await sendNotificationEmail({
        to: email as string,
        subject: params.title,
        text: params.message || params.title,
      });
    }
  } catch (err) {
    console.error("Notification error (non-blocking):", err);
  }
}
