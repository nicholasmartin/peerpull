import { defineContentScript } from "wxt/utils/define-content-script";
import type { ExtensionMessage, PageMetadata } from "@/lib/messages";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Listen for messages from the side panel / background
    chrome.runtime.onMessage.addListener(
      (message: ExtensionMessage, _sender, sendResponse) => {
        if (message.type === "GET_METADATA") {
          const metadata = extractMetadata();
          sendResponse({ type: "METADATA_RESULT", data: metadata });
        }

        if (message.type === "REQUEST_MIC_PERMISSION") {
          requestMicPermission().then((granted) => {
            sendResponse({ type: "MIC_PERMISSION_RESULT", granted });
          });
          return true; // async response
        }
      }
    );
  },
});

function extractMetadata(): PageMetadata {
  const title = document.title || "";
  const url = window.location.href;

  const faviconLink =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
    document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
  const faviconUrl = faviconLink?.href || null;

  const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  const ogImageUrl = ogImage?.content || null;

  const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const ogDescription = ogDesc?.content || metaDesc?.content || null;

  return { title, url, faviconUrl, ogImageUrl, ogDescription };
}

function requestMicPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    const permUrl = chrome.runtime.getURL("permissions.html");

    const iframe = document.createElement("iframe");
    iframe.src = permUrl;
    iframe.allow = "microphone";
    iframe.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1;";

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      iframe.remove();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "PEERPULL_MIC_GRANTED") {
        cleanup();
        resolve(true);
      } else if (event.data?.type === "PEERPULL_MIC_DENIED") {
        cleanup();
        resolve(false);
      }
    };

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);

    // Timeout after 30 seconds
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 30000);
  });
}
