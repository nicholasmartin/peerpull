import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "PeerPull Companion",
    version: "0.1.0",
    description: "Record and share product feedback in seconds.",
    permissions: [
      "tabCapture",
      "activeTab",
      "tabs",
      "sidePanel",
      "storage",
      "offscreen",
      "scripting",
    ],
    host_permissions: ["<all_urls>"],
    icons: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
    side_panel: {
      default_path: "sidepanel/index.html",
    },
    action: {
      default_title: "PeerPull Companion",
    },
    web_accessible_resources: [
      {
        resources: ["permissions.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
  webExt: {
    startUrls: ["https://peerpull.com"],
  },
});
