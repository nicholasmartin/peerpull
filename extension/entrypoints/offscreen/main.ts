// Offscreen document: hosts MediaRecorder since MV3 service workers can suspend.
// Receives a tab capture stream ID, creates MediaRecorder, records, and handles upload.

import { API_BASE_URL, SUPABASE_URL } from "@/lib/constants";
import { getAuthTokens } from "@/lib/storage";
import type { ExtensionMessage } from "@/lib/messages";

let mediaRecorder: MediaRecorder | null = null;
let chunks: Blob[] = [];
let recordedBlob: Blob | null = null;
let duration = 0;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let audioContext: AudioContext | null = null;
let streams: MediaStream[] = [];

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

function cleanupStreams() {
  streams.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  streams = [];
  audioContext?.close();
  audioContext = null;
}

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  switch (message.type) {
    case "START_OFFSCREEN_RECORDING":
      startRecording(message.streamId, message.micDeviceId);
      break;
    case "STOP_OFFSCREEN_RECORDING":
      stopRecording();
      break;
    case "PAUSE_OFFSCREEN_RECORDING":
      pauseRecording();
      break;
    case "RESUME_OFFSCREEN_RECORDING":
      resumeRecording();
      break;
    case "UPLOAD_RECORDING":
      uploadRecording(message.accessToken);
      break;
  }
});

async function startRecording(streamId: string, micDeviceId?: string) {
  try {
    chunks = [];
    recordedBlob = null;
    duration = 0;

    // Get tab media stream using the stream ID
    const tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      } as any,
      video: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      } as any,
    });

    // Get microphone stream
    let micStream: MediaStream | null = null;
    try {
      const audioConstraints = micDeviceId
        ? { deviceId: { exact: micDeviceId } }
        : true;
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
    } catch {
      chrome.runtime.sendMessage({
        type: "RECORDING_ERROR",
        error: "Microphone access is required. Please allow microphone access and try again.",
      } satisfies ExtensionMessage);
      tabStream.getTracks().forEach((t) => t.stop());
      return;
    }

    streams = [tabStream, ...(micStream ? [micStream] : [])];

    // Mix audio streams
    audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const tabAudioTracks = tabStream.getAudioTracks();
    if (tabAudioTracks.length > 0) {
      const tabAudioStream = new MediaStream(tabAudioTracks);
      audioContext.createMediaStreamSource(tabAudioStream).connect(destination);
    }

    if (micStream) {
      audioContext.createMediaStreamSource(micStream).connect(destination);
    }

    // Combine video from tab + mixed audio
    const combinedStream = new MediaStream([
      ...tabStream.getVideoTracks(),
      ...destination.stream.getAudioTracks(),
    ]);

    // Create MediaRecorder
    const mimeType = getSupportedMimeType();
    mediaRecorder = new MediaRecorder(
      combinedStream,
      mimeType ? { mimeType } : undefined
    );

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;

      recordedBlob = new Blob(chunks, { type: mimeType || "video/webm" });
      cleanupStreams();

      chrome.runtime.sendMessage({
        type: "RECORDING_STOPPED",
        duration,
      } satisfies ExtensionMessage);
    };

    // Handle tab close during recording
    const videoTrack = tabStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.onended = () => {
        if (mediaRecorder?.state === "recording") {
          mediaRecorder.stop();
        }
      };
    }

    mediaRecorder.start(1000); // 1-second timeslice

    // Duration timer
    timerInterval = setInterval(() => {
      if (mediaRecorder?.state === "recording") {
        duration++;
        chrome.runtime.sendMessage({
          type: "RECORDING_TICK",
          duration,
        } satisfies ExtensionMessage);
      }
    }, 1000);

    chrome.runtime.sendMessage({
      type: "RECORDING_STARTED",
    } satisfies ExtensionMessage);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start recording";
    chrome.runtime.sendMessage({
      type: "RECORDING_ERROR",
      error: message,
    } satisfies ExtensionMessage);
  }
}

function stopRecording() {
  if (mediaRecorder?.state === "recording" || mediaRecorder?.state === "paused") {
    mediaRecorder.stop();
  }
}

function pauseRecording() {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.pause();
    chrome.runtime.sendMessage({
      type: "RECORDING_PAUSED",
    } satisfies ExtensionMessage);
  }
}

function resumeRecording() {
  if (mediaRecorder?.state === "paused") {
    mediaRecorder.resume();
    chrome.runtime.sendMessage({
      type: "RECORDING_RESUMED",
    } satisfies ExtensionMessage);
  }
}

async function uploadRecording(accessToken: string) {
  if (!recordedBlob) {
    chrome.runtime.sendMessage({
      type: "UPLOAD_ERROR",
      error: "No recording to upload.",
    } satisfies ExtensionMessage);
    return;
  }

  try {
    // Request signed upload URL from the API
    const filename = `ext-review-${Date.now()}.webm`;
    const contentType = recordedBlob.type || "video/webm";

    const signedUrlRes = await fetch(`${API_BASE_URL}/api/v1/upload/signed-url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename, content_type: contentType }),
    });

    const signedUrlJson = await signedUrlRes.json();
    if (signedUrlJson.error) {
      throw new Error(signedUrlJson.error.message || "Failed to get upload URL");
    }

    const { signed_url, path } = signedUrlJson.data;
    console.log("[PeerPull Upload] Got signed URL for path:", path);

    // Upload blob directly to Supabase Storage via signed URL.
    // createSignedUploadUrl returns a URL that expects a POST, not PUT.
    const uploadRes = await fetch(signed_url, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: recordedBlob,
    });

    if (!uploadRes.ok) {
      const errorBody = await uploadRes.text().catch(() => "");
      console.error("[PeerPull Upload] Failed:", uploadRes.status, errorBody);
      throw new Error(`Upload failed with status ${uploadRes.status}: ${errorBody}`);
    }

    // Construct public video URL
    const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/review-videos/${path}`;

    // Clear the blob after successful upload
    recordedBlob = null;
    chunks = [];

    chrome.runtime.sendMessage({
      type: "UPLOAD_COMPLETE",
      videoUrl,
      duration,
    } satisfies ExtensionMessage);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    chrome.runtime.sendMessage({
      type: "UPLOAD_ERROR",
      error: message,
    } satisfies ExtensionMessage);
  }
}
