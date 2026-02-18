"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstname = formData.get("firstname")?.toString() || "";
  const lastname = formData.get("lastname")?.toString() || "";
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/signup",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
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
  } else {
    return encodedRedirect(
      "success",
      "/signup",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
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
    return encodedRedirect("error", "/dashboard/pull-requests/new", "Project name is required");
  }

  // Check points balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", user.id)
    .single();

  if (!profile || profile.peer_points_balance < 2) {
    return encodedRedirect("error", "/dashboard/pull-requests/new", "You need at least 2 PeerPoints to submit a PullRequest. Review other projects to earn points!");
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
    return encodedRedirect("error", "/dashboard/pull-requests/new", "Failed to create PullRequest");
  }

  // Deduct 2 points
  await supabase
    .from("profiles")
    .update({ peer_points_balance: profile.peer_points_balance - 2 })
    .eq("id", user.id);

  await supabase.from("peer_point_transactions").insert({
    user_id: user.id,
    amount: -2,
    type: "spent_submission",
    reference_id: pr.id,
  });

  return redirect("/dashboard/pull-requests");
}

export async function claimReview(pullRequestId: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Check not own PR
  const { data: pr } = await supabase
    .from("pull_requests")
    .select("user_id")
    .eq("id", pullRequestId)
    .single();

  if (!pr) return { error: "PullRequest not found" };
  if (pr.user_id === user.id) return { error: "You cannot review your own project" };

  // Check no existing review
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("pull_request_id", pullRequestId)
    .eq("reviewer_id", user.id)
    .single();

  if (existing) return { error: "You already have a review for this project" };

  const { error } = await supabase.from("reviews").insert({
    pull_request_id: pullRequestId,
    reviewer_id: user.id,
    status: "in_progress",
  });

  if (error) {
    console.error("claimReview insert error:", error);
    return { error: "Failed to claim review: " + error.message };
  }

  redirect(`/dashboard/review-queue/${pullRequestId}/review`);
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

  if (!reviewId) return { error: "Review ID is required" };
  if (!rating || rating < 1 || rating > 5) return { error: "Rating must be 1-5" };
  if (strengths.length < 50) return { error: "Strengths must be at least 50 characters" };
  if (improvements.length < 50) return { error: "Improvements must be at least 50 characters" };
  if (videoDuration < 5) return { error: "Video must be at least 5 seconds" }; // TODO: change back to 60 for production

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

  return redirect("/dashboard/review-queue");
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
  await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);

  // Credit reviewer +1 point
  const { data: reviewerProfile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", review.reviewer_id)
    .single();

  if (reviewerProfile) {
    await supabase
      .from("profiles")
      .update({ peer_points_balance: reviewerProfile.peer_points_balance + 1 })
      .eq("id", review.reviewer_id);

    await supabase.from("peer_point_transactions").insert({
      user_id: review.reviewer_id,
      amount: 1,
      type: "earned_review",
      reference_id: review.id,
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

  await supabase
    .from("reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);

  return { success: true };
}
