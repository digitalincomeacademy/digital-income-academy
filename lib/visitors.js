"use client";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// কতক্ষণ না দেখা গেলে ভিজিটরকে অফলাইন ধরা হবে
const STALE_MS = 90 * 1000;
const HEARTBEAT_MS = 30 * 1000;

function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem("dia_session_id");
    if (!id) {
      id =
        "s_" +
        Math.random().toString(36).slice(2, 10) +
        Date.now().toString(36);
      sessionStorage.setItem("dia_session_id", id);
    }
    return id;
  } catch {
    return (
      "s_" +
      Math.random().toString(36).slice(2, 10) +
      Date.now().toString(36)
    );
  }
}

// লাইভ ভিজিটর কাউন্ট — presence doc লেখে + visitors কালেকশন subscribe করে গোনে
export function useLiveVisitors() {
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const sid = getSessionId();
    if (!sid) {
      setLoading(false);
      return;
    }
    const ref = doc(db, "visitors", sid);
    let alive = true;

    // presence: নিজের ডকুমেন্টে lastSeen লেখো + ৩০ সেকেন্ডে heartbeat
    const beat = () =>
      setDoc(ref, { lastSeen: serverTimestamp() }, { merge: true }).catch(
        () => {}
      );
    beat();
    const timer = setInterval(beat, HEARTBEAT_MS);

    // live count: ৯০ সেকেন্ডের মধ্যে lastSeen আছে এমন ডক গোনো
    const off = onSnapshot(
      collection(db, "visitors"),
      (snap) => {
        if (!alive) return;
        const now = Date.now();
        let n = 0;
        snap.forEach((d) => {
          const ts = d.data()?.lastSeen;
          const ms = ts && ts.toMillis ? ts.toMillis() : 0;
          if (ms && now - ms < STALE_MS) n++;
        });
        setLiveCount(n);
        setLoading(false);
      },
      () => {
        if (alive) setLoading(false);
      }
    );

    return () => {
      alive = false;
      clearInterval(timer);
      off();
      // best-effort: পেজ ছাড়লে নিজের presence ডক মুছে দাও
      deleteDoc(ref).catch(() => {});
    };
  }, []);

  return { liveCount, loading };
}

// মোট ভিজিট গণনা — প্রতি ব্রাউজার সেশনে একবার settings/main এর stats.totalVisits +1
// atomic increment ব্যবহার করা হয় — একসাথে হাজার ভিজিটর এলেও কোনো গণনা হারাবে না
export async function trackTotalVisit() {
  if (!db || typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem("dia_visit_tracked")) return;
  } catch {
    return;
  }
  try {
    const ref = doc(db, "settings", "main");
    await updateDoc(ref, { "stats.totalVisits": increment(1) });
    // শুধু সফলভাবে গণনা হলেই ফ্ল্যাগ বসাও —
    // ব্যর্থ হলে ফ্ল্যাগ বসবে না, পরের পেজ লোডে আবার চেষ্টা হবে
    try {
      sessionStorage.setItem("dia_visit_tracked", "1");
    } catch {}
  } catch {
    // offline / permission — নীরবে এড়িয়ে যাও
  }
}
