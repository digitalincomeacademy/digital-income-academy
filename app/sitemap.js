const BASE = "https://digitalincomeacademy.site";

const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/videos", priority: 0.8, changeFrequency: "weekly" },
  { path: "/apps", priority: 0.7, changeFrequency: "weekly" },
  { path: "/ai-tools", priority: 0.85, changeFrequency: "weekly" },
  { path: "/ai-tools/script-generator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ai-tools/caption-generator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ai-tools/voice-guide", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap() {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
