"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FileText, CalendarDays } from "lucide-react";

const DEFAULT_CONTENT = `## ১. সাধারণ শর্ত
ডিজিটাল ইনকাম একাডেমির ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন। শর্তাবলী সময়ে সময়ে হালনাগাদ হতে পারে; হালনাগাদের পর ওয়েবসাইট ব্যবহার করলে নতুন শর্ত প্রযোজ্য হবে।

## ২. কোর্স ও কনটেন্ট
- আমাদের সব কোর্স ও ভিডিও শুধুমাত্র ব্যক্তিগত শেখার জন্য। কোনো কনটেন্ট অনুলিপি, পুনঃবিক্রয় বা অন্যত্র প্রকাশ করা যাবে না।
- কোর্সের মাধ্যমে শেখানো দক্ষতা দিয়ে আয়ের সম্ভাবনা আপনার পরিশ্রম, ধারাবাহিকতা ও বাস্তবায়নের উপর নির্ভর করে। আমরা নির্দিষ্ট আয়ের গ্যারান্টি দিই না।

## ৩. পেমেন্ট
- পেমেন্ট বিকাশের মাধ্যমে নেওয়া হয়। পেমেন্ট সম্পন্ন হলে ট্রানজেকশন আইডি (TrxID) দিয়ে যাচাই করা হয়।
- ভুল তথ্য দিয়ে পেমেন্ট করলে অ্যাক্সেস দিতে দেরি হতে পারে।

## ৪. রিফান্ড নীতি
- ডিজিটাল পণ্য (কোর্স, ভিডিও) ডেলিভারির পর সাধারণত রিফান্ড দেওয়া হয় না, কারণ কনটেন্ট একবার দেখে ফেলা যায়।
- তবে যৌক্তিক কারণে (যেমন: ভুল কোর্সে এনরোল, টেকনিক্যাল সমস্যায় অ্যাক্সেস না পাওয়া) আমরা কেস-বাই-কেস বিবেচনা করি। রিফান্ডের অনুরোধ support-এ জানান।

## ৫. সৎ ব্যবহারের নীতি
- ভুয়া তথ্য, স্প্যাম বা অন্যের ক্ষতি হয় এমন কোনো কাজে আমাদের প্ল্যাটফর্ম ব্যবহার করা যাবে না।
- নিয়ম ভঙ্গ করলে অ্যাকাউন্ট স্থগিত বা বাতিল করা হতে পারে।

## ৬. যোগাযোগ
শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।`;

function renderContent(text) {
  // Simple markdown-ish rendering: ## headings, - bullets, paragraphs
  const lines = text.split("\n");
  const out = [];
  let bullets = [];
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        <ul key={"ul-" + out.length} className="space-y-2 my-4">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith("## ")) {
      flushBullets();
      out.push(
        <h2
          key={i}
          className="text-xl md:text-2xl font-bold text-white mt-10 mb-3 flex items-center gap-3"
        >
          <span className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
          {t.slice(3)}
        </h2>
      );
    } else if (t.startsWith("- ")) {
      bullets.push(t.slice(2));
    } else if (t === "") {
      flushBullets();
    } else {
      flushBullets();
      out.push(
        <p key={i} className="text-slate-300 leading-relaxed my-3">
          {t}
        </p>
      );
    }
  });
  flushBullets();
  return out;
}

export default function TermsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setData({
            title: d.termsTitle,
            content: d.termsContent,
            updatedAt: d.termsUpdatedAt,
          });
        }
      } catch {
        /* fallback to default */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = data?.title || "শর্তাবলী";
  const content = data?.content || DEFAULT_CONTENT;
  const updatedAt = data?.updatedAt?.toDate?.()
    ? data.updatedAt.toDate().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-10 anim-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-5">
            <FileText className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white anim-in anim-d1">
            {title}
          </h1>
          {updatedAt && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 anim-in anim-d2">
              <CalendarDays className="w-4 h-4" />
              সর্বশেষ হালনাগাদ: {updatedAt}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 md:p-10 shadow-xl anim-in anim-d2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-4 w-full" />
              ))}
            </div>
          ) : (
            renderContent(content)
          )}
        </div>
      </div>
    </main>
  );
}
