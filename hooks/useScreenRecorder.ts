"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecordingStatus = "idle" | "recording" | "stopped";

export interface AudioDevice {
  deviceId: string;
  label: string;
}

const MAX_DURATION = 300; // 5 minutes
const WARNING_THRESHOLD = 270; // 4:30

function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export function useScreenRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState(false);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamsRef = useRef<MediaStream[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streamsRef.current = [];
    audioContextRef.current?.close();
    audioContextRef.current = null;
  }, []);

  // Enumerate microphones — needs a permission grant first
  const refreshMicList = useCallback(async () => {
    try {
      // Request mic access briefly to unlock device labels
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      tempStream.getTracks().forEach((t) => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices
        .filter((d) => d.kind === "audioinput" && d.deviceId)
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 6)}`,
        }));
      setAudioDevices(mics);
      // Default to first mic if none selected
      if (!selectedMic && mics.length > 0) {
        setSelectedMic(mics[0].deviceId);
      }
    } catch {
      // If mic permission denied, continue with empty list
    }
  }, [selectedMic]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const startRecording = useCallback(async () => {
    setError(null);
    setWarning(false);
    chunksRef.current = [];

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true,
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        surfaceSwitching: "exclude",
        systemAudio: "exclude",
      } as DisplayMediaStreamOptions);

      // Validate that the user selected a browser tab (not window/screen)
      const videoTrack = screenStream.getVideoTracks()[0];
      const surface = videoTrack?.getSettings()?.displaySurface;
      if (surface && surface !== "browser") {
        screenStream.getTracks().forEach((t) => t.stop());
        setError(
          "Please select a browser tab, not a window or screen. This ensures the best recording quality.",
        );
        return;
      }

      let micStream: MediaStream | null = null;
      try {
        const audioConstraints: MediaStreamConstraints["audio"] = selectedMic
          ? { deviceId: { exact: selectedMic } }
          : true;
        micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      } catch {
        // Mic not available — continue with screen only
      }

      // Merge audio tracks
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const destination = audioContext.createMediaStreamDestination();

      const screenAudioTracks = screenStream.getAudioTracks();
      if (screenAudioTracks.length > 0) {
        const screenAudioStream = new MediaStream(screenAudioTracks);
        audioContext.createMediaStreamSource(screenAudioStream).connect(destination);
      }

      if (micStream) {
        audioContext.createMediaStreamSource(micStream).connect(destination);
      }

      // Combine video + merged audio
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      streamsRef.current = [screenStream, ...(micStream ? [micStream] : [])];

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(
        combinedStream,
        mimeType ? { mimeType } : undefined,
      );

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        blobRef.current = blob;
        setPreviewUrl(URL.createObjectURL(blob));
        setStatus("stopped");
        cleanup();
      };

      // Stop if user ends screen share via browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setDuration(0);
      setStatus("recording");

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          if (next >= WARNING_THRESHOLD) setWarning(true);
          if (next >= MAX_DURATION) {
            mediaRecorderRef.current?.stop();
          }
          return next;
        });
      }, 1000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start recording";
      if (message.includes("Permission denied") || message.includes("NotAllowedError")) {
        setError("Screen sharing was denied. Please allow access and try again.");
      } else {
        setError(message);
      }
      cleanup();
    }
  }, [cleanup, selectedMic]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    setStatus("idle");
    setDuration(0);
    setWarning(false);
    setError(null);
  }, [previewUrl]);

  const downloadRecording = useCallback(() => {
    if (!blobRef.current) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blobRef.current);
    a.download = `peerpull-recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  return {
    status,
    duration,
    previewUrl,
    error,
    warning,
    isSupported: typeof window !== "undefined" && !!navigator.mediaDevices?.getDisplayMedia,
    audioDevices,
    selectedMic,
    setSelectedMic,
    refreshMicList,
    startRecording,
    stopRecording,
    resetRecording,
    downloadRecording,
    maxDuration: MAX_DURATION,
  };
}
