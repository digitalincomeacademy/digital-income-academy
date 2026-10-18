// AI টুলস হাব — BYOK (Bring Your Own Key) লাইব্রেরি
// ব্যবহারকারীর নিজের ফ্রি API কী শুধু তাদের ব্রাউজারে (localStorage) থাকে —
// সার্ভারে পাঠানো হয় না, একাডেমির কোনো খরচ হয় না।

const LS_KEY = "dia_aitools_keys_v1";

export const PROVIDERS = {
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    kind: "gemini",
    keyUrl: "https://aistudio.google.com/apikey",
    keyHint: "AI Studio থেকে ফ্রি কী নিন (কার্ড লাগে না)",
    defaultModel: "gemini-3.8-flash",
    models: ["gemini-3.8-flash", "gemini-3.8-flash-lite", "gemini-3.7-flash", "gemini-3.6-flash"],
  },
  groq: {
    id: "groq",
    label: "Groq",
    kind: "openai",
    baseUrl: "https://api.groq.com/openai/v1",
    keyUrl: "https://console.groq.com/keys",
    keyHint: "Groq কনসোল থেকে ফ্রি কী নিন (কার্ড লাগে না)",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b"],
  },
  mistral: {
    id: "mistral",
    label: "Mistral AI",
    kind: "openai",
    baseUrl: "https://api.mistral.ai/v1",
    keyUrl: "https://console.mistral.ai/api-keys",
    keyHint: "Mistral কনসোলে ফ্রি মোড ডিফল্ট চালু থাকে",
    defaultModel: "mistral-small-latest",
    models: ["mistral-small-latest", "mistral-medium-latest"],
  },
  custom: {
    id: "custom",
    label: "কাস্টম (OpenAI-কম্প্যাটিবল)",
    kind: "openai",
    baseUrl: "",
    keyUrl: "",
    keyHint: "যেকোনো OpenAI-কম্প্যাটিবল এন্ডপয়েন্ট (যেমন FreeLLMAPI লোকাল সার্ভার)",
    defaultModel: "",
    models: [],
  },
};

export function loadKeyState() {
  if (typeof window === "undefined") return { provider: "gemini", keys: {}, models: {}, customBase: "" };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        provider: p.provider || "gemini",
        keys: p.keys || {},
        models: p.models || {},
        customBase: p.customBase || "",
      };
    }
  } catch (_) {}
  return { provider: "gemini", keys: {}, models: {}, customBase: "" };
}

export function saveKeyState(s) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch (_) {}
}

export function clearKeyState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LS_KEY);
  } catch (_) {}
}

function activeConfig() {
  const s = loadKeyState();
  const p = PROVIDERS[s.provider] || PROVIDERS.gemini;
  return {
    provider: p,
    key: (s.keys[p.id] || "").trim(),
    model: (s.models[p.id] || p.defaultModel || "").trim(),
    baseUrl: p.id === "custom" ? (s.customBase || "").trim().replace(/\/+$/, "") : p.baseUrl,
  };
}

export function hasKey() {
  return !!activeConfig().key;
}

// সৎ মার্কেটিং গার্ডরেল — প্রতিটা প্রম্পটের সাথে যুক্ত হয়
export const HONEST_GUARDRAIL = `নিয়ম (অবশ্যই মানতে হবে): বাংলায় লিখবে। আয়ের গ্যারান্টি দেবে না ("নিশ্চিত আয়", "১০০% লাভ" জাতীয় দাবি নিষেধ)। ভুয়া পেমেন্ট স্ক্রিনশট, ভুয়া টেস্টিমোনিয়াল বা বানানো সংখ্যা/প্রমাণ দেবে না। আকর্ষণীয় কিন্তু সৎ ভাষা ব্যবহার করবে।`;

async function callGemini({ key, model, system, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `Gemini এরর (${res.status})`);
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  if (!text) throw new Error("Gemini থেকে খালি উত্তর এসেছে");
  return text.trim();
}

async function callOpenAICompat({ baseUrl, key, model, system, prompt }) {
  const url = `${baseUrl}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `API এরর (${res.status})`);
  }
  const text = data?.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("API থেকে খালি উত্তর এসেছে");
  return text.trim();
}

export async function generateText({ system, prompt }) {
  const cfg = activeConfig();
  if (!cfg.key) throw new Error("প্রথমে আপনার ফ্রি API কী সেট করুন");
  if (cfg.provider.kind === "gemini") {
    if (!cfg.model) throw new Error("মডেল সিলেক্ট করুন");
    return callGemini({ key: cfg.key, model: cfg.model, system, prompt });
  }
  if (!cfg.baseUrl) throw new Error("কাস্টম প্রোভাইডারের Base URL দিন");
  if (!cfg.model) throw new Error("মডেলের নাম দিন");
  return callOpenAICompat({ baseUrl: cfg.baseUrl, key: cfg.key, model: cfg.model, system, prompt });
}

export function friendlyError(e) {
  const m = String(e?.message || e || "");
  if (/401|403|API key not valid|invalid_api_key|unauthorized/i.test(m))
    return "API কী ভুল বা মেয়াদোত্তীর্ণ — কী টা আবার যাচাই করে বসান।";
  if (/429|quota|rate/i.test(m))
    return "ফ্রি লিমিট শেষ (Rate limit) — কিছুক্ষণ পরে আবার চেষ্টা করুন, বা অন্য প্রোভাইডার/মডেল বেছে নিন।";
  if (/Failed to fetch|NetworkError|network/i.test(m))
    return "ইন্টারনেট সংযোগে সমস্যা — সংযোগ চেক করে আবার চেষ্টা করুন।";
  return m || "অজানা এরর হয়েছে";
}
