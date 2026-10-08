"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

const bn = (n) => n.toLocaleString("bn-BD");

export default function CountUp({ to = 0, suffix = "+" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{bn(v)}{suffix}</span>;
}
