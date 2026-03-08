"use client";

import { useState, useEffect, useCallback } from "react";
import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { getNextReview } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import posthog from "posthog-js";
import { ReadinessStep } from "./steps/readiness-step";
import { BriefingStep, type FeedbackRequestData } from "./steps/briefing-step";
import { RecordingStep } from "./steps/recording-step";
import { SubmitStep } from "./steps/submit-step";

type FlowStep = "readiness" | "briefing" | "recording" | "submitting";

interface FeedbackFlowProps {
  initialReview?: {
    reviewId: string;
    feedbackRequestId: string;
  };
  minDuration: number;
  maxDuration: number;
}

export function FeedbackFlow({
  initialReview,
  minDuration,
  maxDuration,
}: FeedbackFlowProps) {
  const [step, setStep] = useState<FlowStep>("readiness");
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequestData | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const recorder = useScreenRecorder({ maxDuration });

  // Init mic check on mount
  useEffect(() => {
    recorder.refreshMicList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch feedback request data by ID (used for initial review and after claim)
  const fetchFeedbackRequest = useCallback(async (prId: string): Promise<FeedbackRequestData | null> => {
    const supabase = createClient();
    const { data: pr } = await supabase
      .from("feedback_requests")
      .select("*")
      .eq("id", prId)
      .single();

    if (!pr) return null;

    const { data: founderProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", pr.user_id)
      .single();

    return {
      id: pr.id,
      title: pr.title,
      url: pr.url || "",
      description: pr.description || "",
      stage: pr.stage || "",
      categories: pr.categories || [],
      focusAreas: pr.focus_areas || [],
      questions: pr.questions || [],
      founderName: founderProfile?.full_name || "Anonymous",
    };
  }, []);

  // Handle initial review (resume in-progress)
  useEffect(() => {
    if (initialReview) {
      setReviewId(initialReview.reviewId);
      fetchFeedbackRequest(initialReview.feedbackRequestId).then((data) => {
        if (data) {
          setFeedbackRequest(data);
          setStep("briefing");
        }
      });
    }
  }, [initialReview, fetchFeedbackRequest]);

  // Status-driven transitions
  useEffect(() => {
    if (recorder.status === "recording" && step === "briefing") {
      setIsStarting(false);
      setStep("recording");
    }
    if (recorder.status === "stopped" && step === "recording") {
      setStep("submitting");
    }
  }, [recorder.status, step]);

  // Tab title update during recording
  useEffect(() => {
    if (step === "recording") {
      const remaining = Math.max(0, maxDuration - recorder.duration);
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      document.title = `\u{1F534} ${mins}:${secs.toString().padStart(2, "0")} - Recording | PeerPull`;
    } else {
      document.title = "Give Feedback | PeerPull";
    }
    return () => {
      document.title = "PeerPull";
    };
  }, [step, recorder.duration, maxDuration]);

  // Claim next project from queue
  async function handleGetNextProject() {
    setIsClaiming(true);
    try {
      const result = await getNextReview();
      if (result && "error" in result) {
        if (result.error.includes("No projects available")) {
          toast.info(result.error);
        } else {
          toast.error(result.error);
        }
        return;
      }
      if (result && "pr_id" in result) {
        posthog.capture("review_started", {
          feedback_request_id: result.pr_id,
        });
        setReviewId(result.review_id);
        const data = await fetchFeedbackRequest(result.pr_id);
        if (data) {
          setFeedbackRequest(data);
          setStep("briefing");
        } else {
          toast.error("Failed to load project details");
        }
      }
    } finally {
      setIsClaiming(false);
    }
  }

  // Start screen recording (project URL is already opened by BriefingStep)
  async function handleStartRecording() {
    setIsStarting(true);
    await recorder.startRecording();
    setIsStarting(false);
  }

  // Re-record: reset recorder and go back to briefing
  function handleReRecord() {
    recorder.resetRecording();
    setStep("briefing");
  }

  switch (step) {
    case "readiness":
      return (
        <ReadinessStep
          micStatus={recorder.micStatus}
          audioDevices={recorder.audioDevices}
          selectedMic={recorder.selectedMic}
          onSelectMic={recorder.setSelectedMic}
          onRefreshMic={recorder.refreshMicList}
          isSupported={recorder.isSupported}
          onGetNextProject={handleGetNextProject}
          isClaiming={isClaiming}
        />
      );

    case "briefing":
      if (!feedbackRequest) return null;
      return (
        <BriefingStep
          feedbackRequest={feedbackRequest}
          audioDevices={recorder.audioDevices}
          selectedMic={recorder.selectedMic}
          onSelectMic={recorder.setSelectedMic}
          onStartRecording={handleStartRecording}
          isStarting={isStarting}
          error={recorder.error}
        />
      );

    case "recording":
      if (!feedbackRequest) return null;
      return (
        <RecordingStep
          feedbackRequest={feedbackRequest}
          duration={recorder.duration}
          maxDuration={maxDuration}
          minDuration={minDuration}
          warning={recorder.warning}
          error={recorder.error}
          onStopRecording={recorder.stopRecording}
        />
      );

    case "submitting":
      if (!feedbackRequest || !reviewId || !recorder.previewUrl) return null;
      return (
        <SubmitStep
          feedbackRequest={feedbackRequest}
          reviewId={reviewId}
          previewUrl={recorder.previewUrl}
          duration={recorder.duration}
          minDuration={minDuration}
          getBlob={recorder.getBlob}
          onReRecord={handleReRecord}
        />
      );

    default:
      return null;
  }
}
