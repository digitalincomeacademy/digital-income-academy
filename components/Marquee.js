"use client";
import { useCollection } from "@/hooks/useCollection";

export default function Marquee() {
  const { data } = useCollection("announcements", (a) => a.active);
  if (!data.length) return null;
  const items = [...data, ...data, ...data, ...data];
  return (
    <div className="marquee overflow-hidden bg-gold-500 text-navy-950 py-2.5 font-semibold" aria-label="ঘোষণা">
      <div className="marquee-track gap-12">
        {items.map((a, i) => <span key={i} className="px-6 whitespace-nowrap">📢 {a.text}</span>)}
      </div>
    </div>
  );
}
