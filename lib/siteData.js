// Shared helpers for the AI Studio-ported homepage.
"use client";

// UI-তে ইমোজি নিষেধ — টেক্সট থেকে ইমোজি/প্রতীক সরাও
export function stripEmojis(text) {
  if (!text || typeof text !== "string") return text || "";
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// settings.socials অবজেক্ট → SocialIcons-এর জন্য [{id, platform, url}]
export function socialsToLinks(socials) {
  if (!socials) return [];
  if (Array.isArray(socials)) return socials;
  const labels = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    telegram: "Telegram",
    youtube: "YouTube",
  };
  return Object.entries(socials)
    .filter(([, url]) => typeof url === "string" && url.trim())
    .map(([key, url]) => ({ id: key, platform: labels[key] || key, url }));
}

export function normCourse(c) {
  const priceNum = Number(c.price) || 0;
  return {
    id: c.id,
    title: c.title || "",
    description: c.description || "",
    imageUrl: c.image || c.imageUrl || "",
    price: priceNum,
    oldPrice: Number(c.oldPrice) || 0,
    currency: c.currency || "৳",
    isFree: c.isFree ?? priceNum === 0,
    category: c.category || "",
    pinned: !!c.pinned,
    featured: !!c.featured,
    joinUrl: c.joinUrl || (c.slug ? `/courses/${c.slug}` : ""),
    internal: !!c.slug && !c.joinUrl,
  };
}

export function normTool(t) {
  return {
    id: t.id,
    title: t.title || t.name || "",
    description: t.description || "",
    imageUrl: t.icon || t.image || t.imageUrl || "",
    url: t.url || "",
    type: t.type || "FREE",
    category: t.category || "",
    pinned: !!t.pinned,
    featured: !!t.featured,
    price: t.price || "",
    currency: t.currency || "৳",
  };
}

export function normVideo(v) {
  return {
    id: v.id,
    title: v.title || "",
    description: v.description || "",
    videoUrl: v.videoUrl || "",
    thumbnailUrl: v.thumbnail || v.thumbnailUrl || "",
    platform: v.platform || v.category || "YouTube",
    pinned: !!v.pinned,
    featured: !!v.featured,
  };
}

export function normPost(p) {
  return {
    id: p.id,
    title: p.title || "",
    description: p.excerpt || p.description || "",
    imageUrl: p.image || p.imageUrl || "",
    externalUrl: p.externalUrl || "",
    pinned: !!p.pinned,
    createdAt: p.date || p.createdAt || "",
  };
}

export function normMember(m) {
  return {
    id: m.id,
    name: m.name || "",
    position: m.role || m.position || "",
    bio: m.bio || "",
    photoUrl: m.image || m.photoUrl || "",
    links: m.links || null,
  };
}

export function formatBnDate(dateStr) {
  if (!dateStr) return "";
  try {
    // Firestore Timestamp অবজেক্ট হলে toDate() দিয়ে নাও
    const d =
      dateStr && typeof dateStr.toDate === "function"
        ? dateStr.toDate()
        : new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function getYouTubeEmbedId(url) {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}
