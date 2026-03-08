import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

const noopPostHog = {
  capture: () => {},
  identify: () => {},
  shutdown: () => Promise.resolve(),
} as unknown as PostHog;

export function getPostHogClient(): PostHog {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return noopPostHog;

  if (!posthogClient) {
    posthogClient = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
