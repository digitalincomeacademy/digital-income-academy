"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// সাইট-ওয়াইড UI স্টেট: সার্চ মোডাল, লাইভ মোডাল, এক্সটার্নাল লিংক নোটিশ, নোটিফিকেশন
const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [externalLink, setExternalLink] = useState({
    open: false,
    url: "",
    title: "",
    type: "",
  });
  const [hasSubscribedNotifications, setHasSubscribedNotifications] =
    useState(false);

  useEffect(() => {
    try {
      setHasSubscribedNotifications(
        localStorage.getItem("dia_live_notify") === "1"
      );
    } catch {}
  }, []);

  const setExternalLinkNotice = useCallback((notice) => {
    setExternalLink({ open: true, url: "", title: "", type: "", ...notice });
  }, []);

  const closeExternalLink = useCallback(() => {
    setExternalLink((p) => ({ ...p, open: false }));
  }, []);

  const subscribeToLiveNotifications = useCallback(async () => {
    try {
      if (!("Notification" in window)) return;
      if (Notification.permission === "granted") {
        localStorage.setItem("dia_live_notify", "1");
        setHasSubscribedNotifications(true);
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        localStorage.setItem("dia_live_notify", "1");
        setHasSubscribedNotifications(true);
      }
    } catch {}
  }, []);

  return (
    <SiteContext.Provider
      value={{
        searchOpen,
        setSearchOpen,
        liveModalOpen,
        setLiveModalOpen,
        externalLink,
        setExternalLinkNotice,
        closeExternalLink,
        hasSubscribedNotifications,
        subscribeToLiveNotifications,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
