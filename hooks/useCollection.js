"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit as fsLimit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Real-time listener. Sorts by `order` on the client so docs without it still appear.
// Options: { limit: number, orderByField: string, orderDir: 'asc'|'desc' }
export function useCollection(name, filter = () => true, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { limit, orderByField, orderDir = "desc" } = options;
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    let ref = collection(db, name);
    if (orderByField) {
      ref = query(ref, orderBy(orderByField, orderDir), ...(limit ? [fsLimit(limit)] : []));
    } else if (limit) {
      ref = query(ref, fsLimit(limit));
    }
    const off = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(filter);
        if (!orderByField) rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
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
