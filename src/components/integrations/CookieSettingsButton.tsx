"use client";

import { showCookieBanner } from "@/lib/tracking-client";

export function CookieSettingsButton() {
  return (
    <button type="button" className="cookie-settings-button" onClick={showCookieBanner}>
      Cookie Settings
    </button>
  );
}
