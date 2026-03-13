import { useState, useEffect } from "react";
import { PlayCircle, Video, ExternalLink, LogOut, AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/messages";
import StatusBar from "./StatusBar";

function isRestrictedUrl(url: string | undefined): boolean {
  if (!url) return true;
  return (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("chrome:") ||
    url.startsWith("about:") ||
    url.startsWith("edge://") ||
    url.startsWith("devtools://") ||
    url === ""
  );
}

interface HomeScreenProps {
  profile: UserProfile;
  onRecordThisPage: () => void;
  onLogout: () => void;
}

export default function HomeScreen({ profile, onRecordThisPage, onLogout }: HomeScreenProps) {
  const [activeTabUrl, setActiveTabUrl] = useState<string | undefined>(undefined);
  const [tabChecked, setTabChecked] = useState(false);

  useEffect(() => {
    function checkActiveTab() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        setActiveTabUrl(tabs[0]?.url);
        setTabChecked(true);
      });
    }

    checkActiveTab();

    // Re-check when the tab changes
    chrome.tabs.onActivated.addListener(checkActiveTab);
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
      if (changeInfo.url || changeInfo.status === "complete") {
        checkActiveTab();
      }
    });

    return () => {
      chrome.tabs.onActivated.removeListener(checkActiveTab);
      chrome.tabs.onUpdated.removeListener(checkActiveTab);
    };
  }, []);

  const restricted = tabChecked && isRestrictedUrl(activeTabUrl);
  return (
    <div className="flex flex-col h-screen">
      <StatusBar profile={profile} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <div className="text-center mb-2">
          <h2 className="text-lg font-semibold mb-1">
            Hey, {profile.fullName.split(" ")[0] || "there"}!
          </h2>
          <p className="text-xs text-dark-text-muted">What would you like to do?</p>
        </div>

        {/* Next Review button (Phase 6.3, disabled for now) */}
        <button
          disabled
          title="Coming in a future update"
          className={cn(
            "w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-dark-bg",
            "flex items-center justify-center gap-2",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <PlayCircle className="h-5 w-5" />
          Next Review
          <span className="text-[10px] opacity-70 ml-1">(Coming soon)</span>
        </button>

        {/* Record This Page button */}
        <button
          onClick={onRecordThisPage}
          disabled={restricted}
          className={cn(
            "w-full rounded-lg border border-primary px-4 py-3 text-sm font-medium text-primary",
            "hover:bg-primary-subtle flex items-center justify-center gap-2",
            "transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
        >
          <Video className="h-5 w-5" />
          Record This Page
        </button>
        {restricted && (
          <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Navigate to a website first. Chrome internal pages cannot be recorded.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-dark-border flex items-center justify-between">
        <a
          href={`${API_BASE_URL}/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-dark-text-muted hover:text-primary flex items-center gap-1 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Open Dashboard
        </a>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-dark-text-muted/50">v0.1.0</span>
          <button
            onClick={onLogout}
            className="text-xs text-dark-text-muted hover:text-danger flex items-center gap-1 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
