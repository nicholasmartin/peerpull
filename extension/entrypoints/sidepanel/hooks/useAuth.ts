import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";
import { api } from "@/lib/api";
import {
  getAuthTokens,
  setAuthTokens,
  setUserProfile,
  getUserProfile,
  clearAll,
} from "@/lib/storage";
import type { UserProfile, AuthTokens } from "@/lib/messages";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  const updateProfileFromApi = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const data = await api.verifyAuth();
      const profile: UserProfile = {
        id: data.id,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        referralCode: data.referral_code,
        peerPointsBalance: data.peer_points_balance,
        qualityScore: data.quality_score,
        status: data.status,
        unreadNotificationCount: data.unread_notification_count,
      };
      await setUserProfile(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    async function initialize() {
      try {
        const tokens = await getAuthTokens();
        if (!tokens) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired (with 5 min buffer)
        const bufferMs = 5 * 60 * 1000;
        if (tokens.expiresAt < Date.now() + bufferMs) {
          // Try to refresh
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession({
              refresh_token: tokens.refreshToken,
            });

          if (refreshError || !refreshData.session) {
            await clearAll();
            setIsLoading(false);
            return;
          }

          const newTokens: AuthTokens = {
            accessToken: refreshData.session.access_token,
            refreshToken: refreshData.session.refresh_token,
            expiresAt: refreshData.session.expires_at
              ? refreshData.session.expires_at * 1000
              : Date.now() + 3600 * 1000,
          };
          await setAuthTokens(newTokens);
        }

        // Load cached profile first for instant display
        const cached = await getUserProfile();
        if (cached) {
          setUser(cached);
        }

        // Verify via API in background and update
        const fresh = await updateProfileFromApi();
        if (fresh) {
          setUser(fresh);
        } else if (!cached) {
          // Both cached and API failed
          await clearAll();
        }
      } catch {
        await clearAll();
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [updateProfileFromApi]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !data.session) {
          setError(authError?.message || "Login failed. Please check your credentials.");
          setIsLoading(false);
          return;
        }

        const tokens: AuthTokens = {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at
            ? data.session.expires_at * 1000
            : Date.now() + 3600 * 1000,
        };
        await setAuthTokens(tokens);

        const profile = await updateProfileFromApi();
        if (profile) {
          setUser(profile);
        } else {
          setError("Failed to load profile. Please try again.");
          await clearAll();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [updateProfileFromApi]
  );

  const logout = useCallback(async () => {
    await clearAll();
    setUser(null);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fresh = await updateProfileFromApi();
    if (fresh) {
      setUser(fresh);
    }
  }, [updateProfileFromApi]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    refreshProfile,
  };
}
