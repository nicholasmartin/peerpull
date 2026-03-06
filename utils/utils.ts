import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FLASH_COOKIE_NAME } from "@/lib/constants";

const FLASH_COOKIE = FLASH_COOKIE_NAME;

/**
 * Redirects to a specified path with a flash message stored in a cookie.
 * This prevents URL-based message injection attacks.
 */
export async function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, JSON.stringify({ type, message }), {
    path: "/",
    maxAge: 60,
    httpOnly: false,
    sameSite: "lax",
  });
  return redirect(path);
}

/**
 * Reads the flash message cookie. Returns null if no message.
 * The cookie is cleared client-side after display (see FormMessage / FlashToast).
 */
export async function getFlashMessage(): Promise<{ type: "error" | "success"; message: string } | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(FLASH_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.type === "error" || parsed.type === "success") && typeof parsed.message === "string") {
      return { type: parsed.type, message: parsed.message };
    }
  } catch {}
  return null;
}

