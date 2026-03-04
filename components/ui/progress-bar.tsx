"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function NavigationProgressBar() {
  return (
    <AppProgressBar
      height="2px"
      color="#d4a853"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
