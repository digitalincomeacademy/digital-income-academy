"use client";
import { useEffect } from "react";
import Script from "next/script";
import { useSettings } from "@/hooks/useSettings";

// OneSignal web push — loads the SDK asynchronously (lightweight, deferred)
// and initializes only when the admin toggle is ON and an App ID is set.
// Admin: /ceo-rifat-panel/settings → পুশ নোটিফিকেশন
// The App ID is public (it's embedded in client JS by design); the REST API
// key stays server-side in Secure Vault and is never exposed here.

export default function OneSignalInit() {
  const { settings } = useSettings();
  const appId = String(settings?.onesignalAppId || "").trim();
  const enabled = settings?.onesignalEnabled === true && !!appId;

  useEffect(() => {
    if (!enabled) return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({ appId });
      } catch (e) {
        // Silent — push is optional, must never break the site.
      }
    });
  }, [enabled, appId]);

  if (!enabled) return null;

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
    />
  );
}
