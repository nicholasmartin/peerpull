// Message types for communication between extension contexts
// (side panel <-> background service worker <-> offscreen document)

export type ExtensionMessage =
  | { type: "START_RECORDING"; tabId: number; streamId: string; micDeviceId?: string }
  | { type: "STOP_RECORDING" }
  | { type: "PAUSE_RECORDING" }
  | { type: "RESUME_RECORDING" }
  | { type: "ABANDON_RECORDING" }
  | { type: "RECORDING_STARTED" }
  | { type: "RECORDING_PAUSED" }
  | { type: "RECORDING_RESUMED" }
  | { type: "RECORDING_STOPPED"; duration: number }
  | { type: "RECORDING_ERROR"; error: string }
  | { type: "RECORDING_TICK"; duration: number }
  | { type: "UPLOAD_RECORDING"; accessToken: string }
  | { type: "UPLOAD_COMPLETE"; videoUrl: string; duration: number }
  | { type: "UPLOAD_ERROR"; error: string }
  | { type: "GET_METADATA" }
  | { type: "METADATA_RESULT"; data: PageMetadata }
  | { type: "OFFSCREEN_READY" }
  | { type: "START_OFFSCREEN_RECORDING"; streamId: string; micDeviceId?: string }
  | { type: "STOP_OFFSCREEN_RECORDING" }
  | { type: "PAUSE_OFFSCREEN_RECORDING" }
  | { type: "RESUME_OFFSCREEN_RECORDING" }
  | { type: "REQUEST_MIC_PERMISSION"; tabId?: number }
  | { type: "MIC_PERMISSION_RESULT"; granted: boolean };

export interface PageMetadata {
  title: string;
  url: string;
  faviconUrl: string | null;
  ogImageUrl: string | null;
  ogDescription: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  referralCode: string;
  peerPointsBalance: number;
  qualityScore: number | null;
  status: string;
  unreadNotificationCount: number;
}

export interface CachedSettings {
  minVideoDuration: number;
  maxVideoDuration: number;
  reviewReward: number;
  platformLaunched: boolean;
}
