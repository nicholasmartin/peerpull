"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { createNotification } from "@/utils/notifications";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstname = formData.get("firstname")?.toString() || "";
  const lastname = formData.get("lastname")?.toString() || "";
  const referralCode = formData.get("referral_code")?.toString()?.trim() || "";
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/signup",
      "Email and password are required",
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return encodedRedirect(
      "error",
      "/signup",
      "Please enter a valid email address",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        firstname,
        lastname
      }
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/signup", error.message);
  }

  if (data?.user?.identities?.length === 0) {
    return encodedRedirect(
      "error",
      "/signup",
      "An account with this email already exists. Please sign in instead.",
    );
  }

  // Redeem referral code if provided
  if (referralCode && data.user) {
    const { error: refError } = await supabase.rpc("redeem_referral", {
      p_code: referralCode,
      p_new_user_id: data.user.id,
    });
    if (refError) {
      console.error("Referral redemption failed:", refError.message);
    }
  }

  return redirect(`/signup/verify-email?email=${encodeURIComponent(email)}`);
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return encodedRedirect("error", "/signin", "Please enter a valid email address");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/signin", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/signin");
};

// ============================================================
// Helpers
// ============================================================

async function requireActiveUser(supabase: any, userId: string): Promise<{ error?: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", userId)
    .single();

  if (!profile) return { error: "Profile not found" };

  const { data: launchSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "platform_launched")
    .single();

  const platformLaunched = launchSetting?.value === 'true';

  if (profile.status !== 'active' && !platformLaunched) {
    return { error: "Your account is not yet active. Please wait for platform launch." };
  }

  return {};
}

// ============================================================
// PeerPull MVP Actions
// ============================================================

export async function submitFeedbackRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const activeCheck = await requireActiveUser(supabase, user.id);
  if (activeCheck.error) {
    return encodedRedirect("error", "/dashboard", activeCheck.error);
  }

  const title = formData.get("title")?.toString();
  const url = formData.get("url")?.toString() || null;
  const description = formData.get("description")?.toString() || null;
  const stage = formData.get("stage")?.toString() || null;
  const categories = formData.getAll("categories").map(String).filter(Boolean);
  const focusAreas = formData.getAll("focus_areas").map(String).filter(Boolean);
  const questions = [
    formData.get("question1")?.toString(),
    formData.get("question2")?.toString(),
    formData.get("question3")?.toString(),
  ].filter(Boolean) as string[];

  if (!title) {
    return encodedRedirect("error", "/dashboard/request-feedback", "Project name is required");
  }

  const settings = await getSettings();

  // Check points balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", user.id)
    .single();

  if (!profile || profile.peer_points_balance < settings.review_cost_amount) {
    return encodedRedirect("error", "/dashboard/request-feedback", `You need at least ${settings.review_cost_amount} PeerPoint${settings.review_cost_amount !== 1 ? "s" : ""} to submit a Feedback Request. Give feedback on other projects to earn points!`);
  }

  // Check active project limit
  const { count: activeCount } = await supabase
    .from("feedback_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open")
    .not("queue_position", "is", null);

  if ((activeCount ?? 0) >= settings.active_project_limit) {
    return encodedRedirect("error", "/dashboard/request-feedback", `You can only have ${settings.active_project_limit} active project${settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time.`);
  }

  // Insert feedback request
  const { data: pr, error: prError } = await supabase
    .from("feedback_requests")
    .insert({
      user_id: user.id,
      title,
      url,
      description,
      stage,
      categories,
      focus_areas: focusAreas,
      questions,
    })
    .select("id")
    .single();

  if (prError) {
    return encodedRedirect("error", "/dashboard/request-feedback", "Failed to create Feedback Request");
  }

  // Assign queue position (points charged on review completion, not upfront)
  await supabase.rpc("assign_queue_position", { p_pr_id: pr.id });

  const redirectTo = formData.get("redirectTo")?.toString() || "/dashboard/request-feedback";
  return encodedRedirect("success", redirectTo, "Feedback Request created and added to queue!");
}

export async function getNextReview(): Promise<{ error: string } | { pr_id: string } | undefined> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const activeCheck = await requireActiveUser(supabase, user.id);
  if (activeCheck.error) return { error: activeCheck.error };

  const { data, error } = await supabase.rpc("get_next_review", {
    p_reviewer_id: user.id,
  });

  if (error) {
    console.error("getNextReview error:", error);
    return { error: "Failed to get next project" };
  }

  if (!data || data.length === 0) {
    return { error: "No projects available in the queue right now. Check back soon!" };
  }

  return { pr_id: data[0].pr_id };
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const activeCheck = await requireActiveUser(supabase, user.id);
  if (activeCheck.error) return { error: activeCheck.error };

  const reviewId = formData.get("review_id")?.toString();
  const rating = Number(formData.get("rating"));
  const strengths = formData.get("strengths")?.toString()?.trim() || null;
  const improvements = formData.get("improvements")?.toString()?.trim() || null;
  const videoUrl = formData.get("video_url")?.toString() || "";
  const videoDuration = Number(formData.get("video_duration") || 0);
  const signalFollow = formData.get("signal_follow") === "true";
  const signalEngage = formData.get("signal_engage") === "true";
  const signalInvest = formData.get("signal_invest") === "true";

  const settings = await getSettings();

  if (!reviewId) return { error: "Review ID is required" };
  if (rating < 1 || rating > 5) return { error: "Please select a star rating (1-5)" };
  if (strengths && strengths.length < 50) return { error: "Strengths must be at least 50 characters" };
  if (improvements && improvements.length < 50) return { error: "Improvements must be at least 50 characters" };
  if (videoDuration < settings.min_video_duration_seconds) return { error: `Video must be at least ${settings.min_video_duration_seconds} seconds` };

  // Atomically: update review fields, award reviewer points, charge owner, and re-queue if affordable
  const { error: rpcError } = await supabase.rpc("submit_review_atomic", {
    p_review_id: reviewId,
    p_reviewer_id: user.id,
    p_video_url: videoUrl,
    p_video_duration: videoDuration,
    p_rating: rating,
    p_strengths: strengths,
    p_improvements: improvements,
    p_signal_follow: signalFollow,
    p_signal_engage: signalEngage,
    p_signal_invest: signalInvest,
  });

  if (rpcError) {
    return { error: rpcError.message || "Failed to submit feedback" };
  }

  // Notify the feedback request owner
  const { data: notifData } = await supabase
    .from("reviews")
    .select("feedback_request_id, feedback_requests(user_id, title)")
    .eq("id", reviewId)
    .single();

  if (notifData?.feedback_requests) {
    const fr = notifData.feedback_requests as { user_id: string; title: string };
    await createNotification({
      userId: fr.user_id,
      type: "review_received",
      title: "New feedback received",
      message: `Someone submitted video feedback for "${fr.title}"`,
      referenceId: reviewId,
      productTitle: fr.title,
      linkUrl: `/dashboard/request-feedback/${notifData.feedback_request_id}`,
    });
  }

  return redirect("/dashboard/submit-feedback");
}

export async function changeReferralCode(newCode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const normalized = newCode.trim().toLowerCase();
  if (!/^[a-z0-9]{3,20}$/.test(normalized)) {
    return { error: "Code must be 3–20 lowercase letters or numbers" };
  }

  const { error } = await supabase.rpc("change_referral_code", {
    p_user_id: user.id,
    p_new_code: normalized,
  });

  if (error) {
    if (error.message.includes("already taken")) {
      return { error: "That code is already taken" };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function approveReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Verify caller owns the feedback request
  const { data: review } = await supabase
    .from("reviews")
    .select("id, reviewer_id, feedback_request_id, status")
    .eq("id", reviewId)
    .single();

  if (!review) return { error: "Feedback not found" };
  if (review.status !== "submitted") return { error: "Feedback is not in submitted state" };

  const { data: pr } = await supabase
    .from("feedback_requests")
    .select("user_id, title")
    .eq("id", review.feedback_request_id)
    .single();

  if (!pr || pr.user_id !== user.id) return { error: "Only the project owner can approve feedback" };

  // Approve
  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Failed to approve feedback:", updateError);
    return { error: "Failed to approve feedback" };
  }

  await createNotification({
    userId: review.reviewer_id,
    type: "review_approved",
    title: "Your feedback was approved!",
    message: `Your feedback for "${pr.title}" was approved by the project owner`,
    referenceId: reviewId,
    productTitle: pr.title,
    linkUrl: `/dashboard/request-feedback/${review.feedback_request_id}`,
  });

  return { success: true };
}

// ============================================================
// Onboarding Actions
// ============================================================

export async function submitOnboardingProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Verify user is in onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== 'onboarding') {
    return { error: "Not in onboarding state" };
  }

  const title = formData.get("title")?.toString()?.trim();
  const url = formData.get("url")?.toString()?.trim();
  const mode = formData.get("mode")?.toString() || "live";

  if (!title || !url) {
    return { error: "Project name and URL are required" };
  }

  const isDraft = mode === "draft";

  // Insert feedback request (draft skips the queue trigger since status != 'open')
  const { data: pr, error: prError } = await supabase
    .from("feedback_requests")
    .insert({
      user_id: user.id,
      title,
      url,
      status: isDraft ? "draft" : "open",
    })
    .select("id")
    .single();

  if (prError) {
    console.error("Onboarding feedback request insert error:", prError);
    return { error: "Failed to create feedback request" };
  }

  // For live projects, queue position is auto-assigned by the trg_auto_queue_position trigger on insert

  // Transition status from onboarding to waitlisted
  const { error: statusError } = await supabase
    .from("profiles")
    .update({ status: 'waitlisted' })
    .eq("id", user.id);

  if (statusError) {
    return { error: "Failed to complete onboarding" };
  }

  // Award deferred signup bonus (and referral bonus to inviter if referred).
  // These are deferred from account creation to prevent abuse with unverified emails.
  const { error: bonusError } = await supabase.rpc("award_activation_bonuses", {
    p_user_id: user.id,
  });
  if (bonusError) {
    console.error("Failed to award activation bonuses:", bonusError.message);
  }

  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const firstName = formData.get("first_name")?.toString()?.trim() || null;
  const lastName = formData.get("last_name")?.toString()?.trim() || null;
  const website = formData.get("website")?.toString()?.trim() || null;
  const expertise = formData.getAll("expertise").map(String).filter(Boolean);
  const emailPublic = formData.get("email_public") === "true";
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | null = null;

  // Handle avatar upload if provided
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        contentType: avatarFile.type,
        upsert: false
      });

    if (uploadError) {
      return encodedRedirect("error", "/dashboard/profile/edit", "Failed to upload avatar");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrl;
  }

  // Build update object
  const updateData: any = {
    first_name: firstName,
    last_name: lastName,
    website,
    expertise,
    email_public: emailPublic
  };

  // Only update avatar_url if a new avatar was uploaded
  if (avatarUrl) {
    updateData.avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return encodedRedirect("error", "/dashboard/profile/edit", "Failed to update profile");
  }

  return encodedRedirect("success", "/dashboard/profile", "Profile updated successfully");
}

export async function rateReviewAction(
  reviewId: string,
  rating: number,
  flags: string[],
  feedback: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5" };

  const validFlags = ["low_effort", "spam", "irrelevant", "off_topic"];
  const sanitizedFlags = flags.filter(f => validFlags.includes(f));

  const { error } = await supabase.rpc("rate_review", {
    p_review_id: reviewId,
    p_rater_id: user.id,
    p_builder_rating: rating,
    p_builder_flags: sanitizedFlags,
    p_builder_feedback: feedback?.trim() || null,
  });

  if (error) {
    return { error: error.message || "Failed to rate feedback" };
  }

  // Get reviewer info for notification
  const { data: reviewForNotif } = await supabase
    .from("reviews")
    .select("reviewer_id, feedback_request_id, feedback_requests(title)")
    .eq("id", reviewId)
    .single();

  if (reviewForNotif) {
    const title = (reviewForNotif.feedback_requests as { title: string } | null)?.title || "a project";
    await createNotification({
      userId: reviewForNotif.reviewer_id,
      type: "review_rated",
      title: "Your feedback was rated",
      message: `The owner of "${title}" rated your feedback ${rating}/5`,
      referenceId: reviewId,
      productTitle: title,
      rating,
      linkUrl: `/dashboard/request-feedback/${reviewForNotif.feedback_request_id}`,
    });
  }

  return { success: true };
}

export async function rejectReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: review } = await supabase
    .from("reviews")
    .select("id, reviewer_id, feedback_request_id, status")
    .eq("id", reviewId)
    .single();

  if (!review) return { error: "Feedback not found" };
  if (review.status !== "submitted") return { error: "Feedback is not in submitted state" };

  const { data: pr } = await supabase
    .from("feedback_requests")
    .select("user_id, title")
    .eq("id", review.feedback_request_id)
    .single();

  if (!pr || pr.user_id !== user.id) return { error: "Only the project owner can reject feedback" };

  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Failed to reject feedback:", updateError);
    return { error: "Failed to reject feedback" };
  }

  await createNotification({
    userId: review.reviewer_id,
    type: "review_rejected",
    title: "Your feedback was not accepted",
    message: `Your feedback for "${pr.title}" was not accepted by the project owner`,
    referenceId: reviewId,
    productTitle: pr.title,
    linkUrl: `/dashboard/submit-feedback`,
  });

  return { success: true };
}

// ============================================================
// Notification Actions
// ============================================================

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateNotificationPreferences(
  preferences: { event_type: string; email_enabled: boolean }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const validTypes = ["review_received", "review_approved", "review_rejected", "review_rated"];

  for (const pref of preferences) {
    if (!validTypes.includes(pref.event_type)) continue;

    const { error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          user_id: user.id,
          event_type: pref.event_type,
          email_enabled: pref.email_enabled,
          push_enabled: false,
        },
        { onConflict: "user_id,event_type" }
      );

    if (error) {
      return { error: "Failed to save preferences" };
    }
  }

  return { success: true };
}
