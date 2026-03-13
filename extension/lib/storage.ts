import { STORAGE_KEYS, SETTINGS_CACHE_TTL } from "./constants";
import type { AuthTokens, UserProfile, CachedSettings } from "./messages";

// Generic chrome.storage.local helpers
async function get<T>(key: string): Promise<T | null> {
  const result = await chrome.storage.local.get(key);
  return (result[key] as T) ?? null;
}

async function set(key: string, value: unknown): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

async function remove(key: string): Promise<void> {
  await chrome.storage.local.remove(key);
}

// Auth tokens
export async function getAuthTokens(): Promise<AuthTokens | null> {
  return get<AuthTokens>(STORAGE_KEYS.authTokens);
}

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  return set(STORAGE_KEYS.authTokens, tokens);
}

export async function clearAuthTokens(): Promise<void> {
  return remove(STORAGE_KEYS.authTokens);
}

// User profile
export async function getUserProfile(): Promise<UserProfile | null> {
  return get<UserProfile>(STORAGE_KEYS.userProfile);
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  return set(STORAGE_KEYS.userProfile, profile);
}

export async function clearUserProfile(): Promise<void> {
  return remove(STORAGE_KEYS.userProfile);
}

// Settings cache
export async function getCachedSettings(): Promise<CachedSettings | null> {
  const cacheTime = await get<number>(STORAGE_KEYS.settingsCacheTime);
  if (!cacheTime || Date.now() - cacheTime > SETTINGS_CACHE_TTL) {
    return null; // Cache expired or missing
  }
  return get<CachedSettings>(STORAGE_KEYS.settingsCache);
}

export async function setCachedSettings(settings: CachedSettings): Promise<void> {
  await set(STORAGE_KEYS.settingsCache, settings);
  await set(STORAGE_KEYS.settingsCacheTime, Date.now());
}

// Preferences (e.g., "don't show navigation confirmation")
export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
  const prefs = await get<Record<string, unknown>>(STORAGE_KEYS.preferences);
  if (!prefs || !(key in prefs)) return defaultValue;
  return prefs[key] as T;
}

export async function setPreference(key: string, value: unknown): Promise<void> {
  const prefs = await get<Record<string, unknown>>(STORAGE_KEYS.preferences) || {};
  prefs[key] = value;
  await set(STORAGE_KEYS.preferences, prefs);
}

// Clear all PeerPull data (logout)
export async function clearAll(): Promise<void> {
  await chrome.storage.local.remove(Object.values(STORAGE_KEYS));
}
