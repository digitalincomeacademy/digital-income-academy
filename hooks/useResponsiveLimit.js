"use client";
import { useState, useEffect } from "react";

/** Returns 4 on desktop (lg+), 3 on smaller screens. */
export function useResponsiveLimit() {
  const [limit, setLimit] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLimit(mq.matches ? 4 : 3);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return limit;
}
