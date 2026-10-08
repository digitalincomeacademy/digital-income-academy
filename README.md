# Digital Income Academy — Part 1

1. `npm install`
2. `.env.local.example` কপি করে `.env.local` নাম দিন, Firebase কী বসান।
3. `npm run dev` → http://localhost:3000
4. Firebase Console → Firestore → Rules এ `firestore.rules`, Storage → Rules এ `storage.rules` পেস্ট করুন।
5. Vercel: GitHub এ push → Import Project → Environment Variables যোগ → Deploy।

## লাইভ ভিজিটর কাউন্টার (স্পেশাল ফিচার)

নেভবারে "এই মুহূর্তে N জন অনলাইনে" ব্যাজ লাইভ দেখায়।

**কীভাবে কাজ করে:**
- প্রতিটি ভিজিটরের ব্রাউজারে একটি sessionId তৈরি হয় (`lib/visitors.js`)।
- `visitors/{sessionId}` ডকুমেন্টে `{ lastSeen: serverTimestamp }` লেখা হয়, প্রতি ৩০ সেকেন্ডে heartbeat আপডেট হয়।
- পেজ বন্ধ করলে ডকুমেন্ট মুছে ফেলার চেষ্টা করা হয় (best-effort)।
- `useLiveVisitors()` হুক `visitors` কালেকশন subscribe করে গত ৯০ সেকেন্ডে `lastSeen` আছে এমন ডকুমেন্ট গোনে।
- `trackTotalVisit()` প্রতি ব্রাউজার সেশনে একবার `settings/main` এর `stats.totalVisits` ১ বাড়ায় (Firestore transaction)।
- Firebase কী না থাকলে (`db == null`) কাউন্টার নীরবে ০ দেখায় — বিল্ড/সাইট ভাঙে না।

**Firestore Rules:** `visitors` কালেকশনে পাবলিক read অনুমতি আছে (গণনার জন্য দরকার); create/update শুধু `lastSeen` টাইমস্ট্যাম্প ফিল্ডে সীমাবদ্ধ। `settings/main` এ পাবলিক শুধু `stats.totalVisits` ঠিক ১ বাড়াতে পারে — বাকি সব লেখা শুধু অ্যাডমিনের।

## Seed Data ইমপোর্ট

`seed/firestore-seed.json` ফাইলে সব কালেকশনের স্যাম্পল ডেটা আছে (প্রতিটি ডকে `_sample: "SAMPLE — ADMIN REPLACE"` মার্কার)।

**Firebase Console থেকে হাতে ইমপোর্ট:**
1. Firebase Console → Firestore Database → **Start collection**
2. Collection ID দিন (যেমন `courses`) → **Add document** → **Auto-ID**
3. `seed/firestore-seed.json` এর `collections.courses[0]` এর ফিল্ডগুলো একে একে বসান (string/number/boolean/array/map টাইপ খেয়াল করে)।
4. একইভাবে `videos`, `tools`, `apps`, `announcements`, `faqs` কালেকশন বানান।
5. `settings` কালেকশনে ডকুমেন্ট ID **`main`** দিয়ে `docs["settings/main"]` এর ফিল্ড বসান।
6. `testimonials` ইচ্ছা করে খালি — ভুয়া রিভিউ কখনো বানাবেন না।

**দ্রুত উপায় (ঐচ্ছিক):** `firebase-admin` SDK দিয়ে একটি Node স্ক্রিপ্ট লিখে JSON পড়ে batch write করুন।

## অ্যাডমিন প্রথম লগইন

1. Firebase Console → **Authentication** → **Sign-in method** → **Email/Password** চালু করুন।
2. **Users** → **Add user** → অ্যাডমিনের ইমেইল + পাসওয়ার্ড দিয়ে ইউজার তৈরি করুন।
3. Firestore → `settings/main` ডকুমেন্টের `admins` অ্যারেতে ওই ইমেইল যোগ করুন (seed-এ `[]` খালি আছে)।
4. সাইটে `/admin/login` এ গিয়ে লগইন করুন।
5. লগইনের পর ড্যাশবোর্ড থেকে কোর্স, ভিডিও, টুলস, অ্যানাউন্সমেন্ট সব ম্যানেজ করুন — পরিবর্তন সাথে সাথে লাইভ সাইটে দেখা যাবে (Firebase real-time)।
