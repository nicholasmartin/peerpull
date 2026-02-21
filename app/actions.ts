"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
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

  return encodedRedirect(
    "success",
    "/signup",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
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
// PeerPull MVP Actions
// ============================================================

export async function submitPullRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

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
    return encodedRedirect("error", "/dashboard/request-feedback", `You need at least ${settings.review_cost_amount} PeerPoint${settings.review_cost_amount !== 1 ? "s" : ""} to submit a PullRequest. Review other projects to earn points!`);
  }

  // Check active project limit
  const { count: activeCount } = await supabase
    .from("pull_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open")
    .not("queue_position", "is", null);

  if ((activeCount ?? 0) >= settings.active_project_limit) {
    return encodedRedirect("error", "/dashboard/request-feedback", `You can only have ${settings.active_project_limit} active project${settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time.`);
  }

  // Insert pull request
  const { data: pr, error: prError } = await supabase
    .from("pull_requests")
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
    return encodedRedirect("error", "/dashboard/request-feedback", "Failed to create PullRequest");
  }

  // Assign queue position (points charged on review completion, not upfront)
  await supabase.rpc("assign_queue_position", { p_pr_id: pr.id });

  return redirect("/dashboard/request-feedback");
}

export async function getNextReview(): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data, error } = await supabase.rpc("get_next_review", {
    p_reviewer_id: user.id,
  });

  if (error) {
    console.error("getNextReview error:", error);
    return { error: "Failed to get next review" };
  }

  if (!data || data.length === 0) {
    return { error: "No projects available in the queue right now. Check back soon!" };
  }

  redirect(`/dashboard/submit-feedback/${data[0].pr_id}/review`);
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const reviewId = formData.get("review_id")?.toString();
  const rating = Number(formData.get("rating"));
  const strengths = formData.get("strengths")?.toString() || "";
  const improvements = formData.get("improvements")?.toString() || "";
  const videoUrl = formData.get("video_url")?.toString() || "";
  const videoDuration = Number(formData.get("video_duration") || 0);

  const settings = await getSettings();

  if (!reviewId) return { error: "Review ID is required" };
  if (strengths && strengths.length < 50) return { error: "Strengths must be at least 50 characters" };
  if (improvements && improvements.length < 50) return { error: "Improvements must be at least 50 characters" };
  if (videoDuration < settings.min_video_duration_seconds) return { error: `Video must be at least ${settings.min_video_duration_seconds} seconds` };

  const { error } = await supabase
    .from("reviews")
    .update({
      video_url: videoUrl,
      video_duration: videoDuration,
      rating,
      strengths,
      improvements,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("reviewer_id", user.id);

  if (error) return { error: "Failed to submit review" };

  // Award reviewer +1, charge owner -2, auto-re-queue if affordable
  const { error: rpcError } = await supabase.rpc("complete_review_and_charge", {
    p_reviewer_id: user.id,
    p_review_id: reviewId,
  });

  if (rpcError) {
    console.error("Failed to complete review and charge:", rpcError);
  }

  return redirect("/dashboard/submit-feedback");
}

export async function approveReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Verify caller owns the PR
  const { data: review } = await supabase
    .from("reviews")
    .select("id, reviewer_id, pull_request_id, status")
    .eq("id", reviewId)
    .single();

  if (!review) return { error: "Review not found" };
  if (review.status !== "submitted") return { error: "Review is not in submitted state" };

  const { data: pr } = await supabase
    .from("pull_requests")
    .select("user_id")
    .eq("id", review.pull_request_id)
    .single();

  if (!pr || pr.user_id !== user.id) return { error: "Only the PR owner can approve reviews" };

  // Approve
  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Failed to approve review:", updateError);
    return { error: "Failed to approve review" };
  }

  return { success: true };
}

export async function rejectReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: review } = await supabase
    .from("reviews")
    .select("id, pull_request_id, status")
    .eq("id", reviewId)
    .single();

  if (!review) return { error: "Review not found" };
  if (review.status !== "submitted") return { error: "Review is not in submitted state" };

  const { data: pr } = await supabase
    .from("pull_requests")
    .select("user_id")
    .eq("id", review.pull_request_id)
    .single();

  if (!pr || pr.user_id !== user.id) return { error: "Only the PR owner can reject reviews" };

  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);

  if (updateError) {
    console.error("Failed to reject review:", updateError);
    return { error: "Failed to reject review" };
  }

  return { success: true };
}
