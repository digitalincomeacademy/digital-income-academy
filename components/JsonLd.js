"use client";

// JSON-LD structured data (Organization + WebSite) for SEO.
// Rendered client-side; kept tiny and dependency-free.
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://digitalincomeacademy.site/#org",
      name: "Digital Income Academy",
      url: "https://digitalincomeacademy.site",
      slogan: "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে",
      sameAs: [
        "https://www.facebook.com/Digital.Incomee.Academy",
        "https://www.youtube.com/@DigitalIncomeeAcademy",
        "https://www.instagram.com/digtalincomeacademy",
        "https://www.tiktok.com/@digtalincomeacademy",
        "https://t.me/digitalincomeaacademy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://digitalincomeacademy.site/#site",
      url: "https://digitalincomeacademy.site",
      name: "Digital Income Academy",
      inLanguage: "bn",
      publisher: { "@id": "https://digitalincomeacademy.site/#org" },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  );
}
