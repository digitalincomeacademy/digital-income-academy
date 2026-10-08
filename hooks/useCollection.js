"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Real-time listener. Sorts by `order` on the client so docs without it still appear.
export function useCollection(name, filter = () => true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const off = onSnapshot(
      collection(db, name),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(filter);
        rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setData(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return off;
    // eslint-disable-next-line
  }, [name]);
  return { data, loading };
}
