"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// settings/main ডকুমেন্টের রিয়েল-টাইম হুক
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const off = onSnapshot(
      doc(db, "settings", "main"),
      (snap) => {
        setSettings(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return off;
  }, []);
  return { settings, loading };
}
