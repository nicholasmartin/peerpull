// API base URL — reads from environment or defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Supabase public keys (safe to bundle in extension)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// chrome.storage keys
export const STORAGE_KEYS = {
  authTokens: "peerpull_auth_tokens",
  userProfile: "peerpull_user_profile",
  settingsCache: "peerpull_settings_cache",
  settingsCacheTime: "peerpull_settings_cache_time",
  preferences: "peerpull_preferences",
} as const;

// Settings cache TTL (24 hours in milliseconds)
export const SETTINGS_CACHE_TTL = 24 * 60 * 60 * 1000;

// Notification polling interval (60 seconds)
export const NOTIFICATION_POLL_INTERVAL = 60 * 1000;
