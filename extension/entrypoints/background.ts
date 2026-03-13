import { defineBackground } from "wxt/utils/define-background";
import type { ExtensionMessage } from "@/lib/messages";

export default defineBackground(() => {
  // When toolbar icon is clicked: open the side panel.
  // We DON'T use openPanelOnActionClick because we also need to handle
  // activeTab grants for tabCapture via action.onClicked.
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });

  let offscreenDocumentCreated = false;

  async function ensureOffscreenDocument(): Promise<void> {
    if (offscreenDocumentCreated) return;

    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    });
    if (existingContexts.length > 0) {
      offscreenDocumentCreated = true;
      return;
    }

    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: "Recording tab audio and video for PeerPull review",
    });
    offscreenDocumentCreated = true;
  }

  async function closeOffscreenDocument(): Promise<void> {
    if (!offscreenDocumentCreated) return;
    try {
      await chrome.offscreen.closeDocument();
    } catch {
      // Already closed
    }
    offscreenDocumentCreated = false;
  }

  // Listen for messages from side panel and offscreen document
  chrome.runtime.onMessage.addListener(
    (message: ExtensionMessage, _sender, sendResponse) => {
      handleMessage(message)
        .then((result) => sendResponse(result))
        .catch((err) => {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          console.error("[PeerPull BG] Error handling message:", message.type, errorMsg);
          chrome.runtime.sendMessage({
            type: "RECORDING_ERROR",
            error: errorMsg,
          } satisfies ExtensionMessage).catch(() => {});
          sendResponse({ error: errorMsg });
        });
      return true;
    }
  );

  async function handleMessage(message: ExtensionMessage): Promise<unknown> {
    switch (message.type) {
      case "START_RECORDING": {
        // The side panel (foreground page) already obtained the streamId
        // via chrome.tabCapture.getMediaStreamId, which requires a
        // foreground context in MV3.
        console.log("[PeerPull BG] Received stream ID, creating offscreen document");
        await ensureOffscreenDocument();

        console.log("[PeerPull BG] Sending START_OFFSCREEN_RECORDING");
        chrome.runtime.sendMessage({
          type: "START_OFFSCREEN_RECORDING",
          streamId: message.streamId,
          micDeviceId: message.micDeviceId,
        } satisfies ExtensionMessage).catch(() => {});

        return { ok: true };
      }

      case "STOP_RECORDING": {
        chrome.runtime.sendMessage({
          type: "STOP_OFFSCREEN_RECORDING",
        } satisfies ExtensionMessage).catch(() => {});
        return { ok: true };
      }

      case "PAUSE_RECORDING": {
        chrome.runtime.sendMessage({
          type: "PAUSE_OFFSCREEN_RECORDING",
        } satisfies ExtensionMessage).catch(() => {});
        return { ok: true };
      }

      case "RESUME_RECORDING": {
        chrome.runtime.sendMessage({
          type: "RESUME_OFFSCREEN_RECORDING",
        } satisfies ExtensionMessage).catch(() => {});
        return { ok: true };
      }

      case "ABANDON_RECORDING": {
        chrome.runtime.sendMessage({
          type: "STOP_OFFSCREEN_RECORDING",
        } satisfies ExtensionMessage).catch(() => {});
        setTimeout(() => closeOffscreenDocument(), 500);
        return { ok: true };
      }

      case "REQUEST_MIC_PERMISSION": {
        const targetTabId = message.tabId;
        if (!targetTabId) {
          return { granted: false };
        }

        // Try sending to content script directly first
        try {
          const response = await chrome.tabs.sendMessage(targetTabId, {
            type: "REQUEST_MIC_PERMISSION",
          } satisfies ExtensionMessage);
          return response;
        } catch {
          // Content script not present, inject it and retry
          console.log("[PeerPull BG] Content script not found, injecting into tab", targetTabId);
        }

        try {
          await chrome.scripting.executeScript({
            target: { tabId: targetTabId },
            files: ["/content-scripts/content.js"],
          });
          // Brief delay for the script to initialize its listener
          await new Promise((r) => setTimeout(r, 100));
          const response = await chrome.tabs.sendMessage(targetTabId, {
            type: "REQUEST_MIC_PERMISSION",
          } satisfies ExtensionMessage);
          return response;
        } catch (err) {
          console.error("[PeerPull BG] Failed to inject content script:", err);
          return { granted: false };
        }
      }

      default:
        return undefined;
    }
  }
});
