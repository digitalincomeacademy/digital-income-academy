"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

// Kajla AI — lightweight academy chatbot (no API, built-in Bengali FAQ).
// Visibility: admin /ceo-rifat-panel/settings → যোগাযোগ → কাজলা AI টগল.
// Rendered inside the ContactButtons floating stack (below WhatsApp).

const QUICK = ["কোর্সসমূহ", "ভর্তি প্রক্রিয়া", "ফ্রি রিসোর্স", "যোগাযোগ"];

const FAQ = [
  {
    k: ["সালাম", "আসসালাম", "হ্যালো", "hello", "hi", "হায়", "আদাব"],
    a: "ওয়ালাইকুম আসসালাম! 👋 আমি কাজলা — Digital Income Academy-এর AI সহকারী। কোর্স, ভর্তি, ফ্রি রিসোর্স — যেকোনো বিষয়ে জিজ্ঞেস করুন!",
  },
  {
    k: ["একাডেমি", "academy", "সম্পর্কে", "প্রতিষ্ঠান", "কী শেখায়"],
    a: "Digital Income Academy — শিখুন, তৈরি করুন, আয় করুন — সৎভাবে। এখানে বাস্তব স্কিল শেখানো হয়: ব্লগার ওয়েবসাইট তৈরি, HTML/CSS, ওয়েবসাইট কাস্টমাইজেশন, ফেসবুক-গুগল অ্যাড মার্কেটিং ও ভিডিও মার্কেটিং।",
  },
  {
    k: ["কোর্স", "course", "কী কী", "শিখব"],
    a: "আমাদের জনপ্রিয় কোর্স: 📚 Digital Income Learning Package (৫টি স্কিল — ব্লগার ওয়েবসাইট, HTML & CSS, কাস্টমাইজেশন, অ্যাড মার্কেটিং, ভিডিও মার্কেটিং) এবং 🎓 Digital Income Masterclass (১০ মডিউলের সম্পূর্ণ বাংলা কোর্স)। বিস্তারিত দেখুন হোমপেজের কোর্স সেকশনে।",
  },
  {
    k: ["ভর্তি", "কিনব", "কেনা", "buy", "enroll", "প্রক্রিয়া", "কীভাবে নেব"],
    a: "ভর্তি প্রক্রিয়া সহজ:\n1️⃣ পছন্দের কোর্সে \"কিনুন\" চাপুন\n2️⃣ বিকাশে পেমেন্ট করে TrxID দিন\n3️⃣ অ্যাডমিন অনুমোদন দিলে ডাউনলোড লিংক পেয়ে যাবেন ✅",
  },
  {
    k: ["দাম", "price", "খরচ", "fee", "টাকা", "মূল্য"],
    a: "Digital Income Masterclass (১০ মডিউল) — ৳৩,৪৯৯। প্রতিটি কোর্সের বর্তমান মূল্য ও ছাড় কোর্স কার্ডেই দেখতে পাবেন।",
  },
  {
    k: ["বিকাশ", "পেমেন্ট", "payment", "bkash", "টাকা পাঠাব"],
    a: "পেমেন্ট বিকাশে করতে হয়। \"কিনুন\" চাপ দিলে বিকাশ নম্বর/লিংক ও নির্দেশনা দেখাবে — পেমেন্ট করে TrxID (ট্রানজেকশন আইডি) সাবমিট করুন।",
  },
  {
    k: ["ফ্রি", "free", "বিনামূল্যে", "ফ্রিতে"],
    a: "একদম ফ্রি রিসোর্সও আছে! 🎁 শিক্ষামূলক ভিডিও, দরকারি অ্যাপস, স্মার্ট ডিজিটাল টুলস ও নিয়মিত পোস্ট — সব হোমপেজেই পাবেন, কোনো টাকা লাগে না।",
  },
  {
    k: ["যোগাযোগ", "contact", "ফোন", "phone", "whatsapp", "হোয়াটসঅ্যাপ", "নম্বর", "কথা বলব"],
    a: "যোগাযোগ করতে পারেন:\n💬 WhatsApp — পেজের ডান-নিচের সবুজ বাটনে চাপুন\n✈️ Telegram — নীল বাটনে চাপুন\n📘 Facebook: Digital Income Academy পেজে মেসেজ করুন",
  },
  {
    k: ["পোর্টফোলিও", "portfolio", "রিফাত", "rifat", "ফাউন্ডার", "প্রতিষ্ঠাতা"],
    a: "MD RIFAT SARKER — Digital Creator, Graphic Designer, Video Editor ও AI & Software Developer। তিনি Digital Income Academy-এর প্রতিষ্ঠাতা। তার সম্পূর্ণ পোর্টফোলিও: https://mdrifatsarker.com/ 🌟",
  },
  {
    k: ["ধন্যবাদ", "thanks", "thank you", "শুকরিয়া"],
    a: "আপনাকেও ধন্যবাদ! 😊 আর কোনো প্রশ্ন থাকলে জিজ্ঞেস করুন — আমি এখানেই আছি।",
  },
  {
    k: ["টেলিগ্রাম", "telegram", "গ্রুপ", "চ্যানেল"],
    a: "আমাদের Telegram গ্রুপ ও চ্যানেলে যুক্ত হোন — নতুন পোস্ট ও আপডেট সবার আগে পাবেন। লিংক পাবেন ওয়েবসাইটের ফুটারে।",
  },
];

const FALLBACK =
  "দুঃখিত, এটা ঠিক বুঝতে পারিনি। 😅 নিচের যেকোনো বিষয়ে জিজ্ঞেস করুন — কোর্স, ভর্তি প্রক্রিয়া, দাম, ফ্রি রিসোর্স বা যোগাযোগ। অথবা WhatsApp বাটনে সরাসরি কথা বলুন!";

function answerFor(text) {
  const t = String(text || "").toLowerCase();
  for (const item of FAQ) {
    if (item.k.some((kw) => t.includes(kw.toLowerCase()))) return item.a;
  }
  return FALLBACK;
}

export default function KajlaChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "আসসালামু আলাইকুম! 👋 আমি কাজলা — Digital Income Academy সম্পর্কে যেকোনো প্রশ্ন করুন!" },
  ]);
  const [input, setInput] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, open]);

  const send = (raw) => {
    const text = String(raw ?? input).trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "user", text }, { from: "bot", text: answerFor(text) }]);
    setInput("");
  };

  return (
    <>
      {/* Floating button (sits in the ContactButtons stack) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="কাজলা AI-এর সাথে চ্যাট করুন"
        title="কাজলা AI-এর সাথে চ্যাট করুন"
        className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30"
      >
        {open ? (
          <X className="w-7 h-7" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10c.4 0 .8 0 1.2-.1L21 24l-2.1-6.2A10 10 0 0 0 12 2zm-4 8.5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" opacity=".95" />
            <path d="M8 10.5h8v2H8z" opacity=".35" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[330px] max-w-[calc(100vw-2.5rem)] h-[440px] max-h-[calc(100vh-9rem)] bg-slate-900 border border-emerald-500/25 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">কাজলা AI 🤖</p>
              <p className="text-emerald-100/80 text-xs">Digital Income Academy সহকারী</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="বন্ধ করুন" className="text-white/90 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div ref={boxRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-950/60">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                  m.from === "bot"
                    ? "bg-emerald-500/15 text-emerald-50 self-start rounded-bl-sm border border-emerald-500/20"
                    : "bg-emerald-600 text-white self-end rounded-br-sm ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="px-3 pt-2 flex flex-wrap gap-1.5 bg-slate-950/60">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="p-3 flex gap-2 bg-slate-950/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="প্রশ্ন লিখুন..."
              className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => send()}
              aria-label="পাঠান"
              className="w-10 h-10 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
