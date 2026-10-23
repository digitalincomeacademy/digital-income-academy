// Public read-only endpoint for the Telegram auto-post monitor.
// Returns recent posts + the telegramAutoPost toggle. No secrets here.
// MUST NOT be cached — the hook needs fresh data every poll.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function db() {
  const app = getApps().length ? getApp() : initializeApp(config);
  return getFirestore(app);
}

const CORS_ORIGIN = "https://freetools.digitalincomeacademy.site";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  Vary: "Origin",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const database = db();
    const [postsSnap, appsSnap, videosSnap, coursesSnap, settingsSnap] =
      await Promise.all([
        getDocs(collection(database, "posts")),
        getDocs(collection(database, "apps")),
        getDocs(collection(database, "videos")),
        getDocs(collection(database, "courses")),
        getDoc(doc(database, "settings", "main")),
      ]);
    const posts = postsSnap.docs
      .map((d) => {
        const f = d.data();
        let createdMs = 0;
        const ca = f.createdAt;
        if (ca?.toMillis) createdMs = ca.toMillis();
        else if (typeof ca === "number") createdMs = ca;
        return {
          id: d.id,
          title: f.title || "",
          excerpt: (f.excerpt || "").slice(0, 400),
          prompt: (f.prompt || "").slice(0, 2000),
          image: f.image || f.imageUrl || "",
          active: f.active !== false,
          createdMs,
        };
      })
      .sort((a, b) => b.createdMs - a.createdMs)
      .slice(0, 50);
    const apps = appsSnap.docs
      .map((d) => {
        const f = d.data();
        let createdMs = 0;
        const ca = f.createdAt;
        if (ca?.toMillis) createdMs = ca.toMillis();
        else if (typeof ca === "number") createdMs = ca;
        return {
          id: d.id,
          type: "app",
          title: f.title || f.name || "",
          excerpt: (f.description || f.excerpt || "").slice(0, 400),
          image: f.image || f.imageUrl || f.icon || "",
          downloadUrl: f.downloadUrl || f.link || "",
          active: f.active !== false && f.status !== "draft",
          createdMs,
        };
      })
      .sort((a, b) => b.createdMs - a.createdMs)
      .slice(0, 50);
    const videos = videosSnap.docs
      .map((d) => {
        const f = d.data();
        let createdMs = 0;
        const ca = f.createdAt;
        if (ca?.toMillis) createdMs = ca.toMillis();
        else if (typeof ca === "number") createdMs = ca;
        return {
          id: d.id,
          type: "video",
          title: f.title || "",
          excerpt: (f.description || f.excerpt || "").slice(0, 400),
          image: f.thumbnail || f.image || f.imageUrl || "",
          videoUrl: f.videoUrl || f.url || "",
          active: f.active !== false,
          createdMs,
        };
      })
      .sort((a, b) => b.createdMs - a.createdMs)
      .slice(0, 50);
    const courses = coursesSnap.docs
      .map((d) => {
        const f = d.data();
        let createdMs = 0;
        const ca = f.createdAt;
        if (ca?.toMillis) createdMs = ca.toMillis();
        else if (typeof ca === "number") createdMs = ca;
        return {
          id: d.id,
          type: "course",
          title: f.title || "",
          excerpt: (f.description || f.excerpt || "").slice(0, 400),
          image: f.thumbnail || f.image || f.imageUrl || "",
          price: f.price || "",
          active: f.active !== false,
          createdMs,
        };
      })
      .sort((a, b) => b.createdMs - a.createdMs)
      .slice(0, 50);
    const telegramAutoPost =
      settingsSnap.exists() && settingsSnap.data().telegramAutoPost === true;
    const sdata = settingsSnap.exists() ? settingsSnap.data() : {};
    const onesignalEnabled = sdata.onesignalEnabled === true;
    const onesignalAppId = String(sdata.onesignalAppId || "").trim();
    return Response.json(
      {
        ok: true,
        telegramAutoPost,
        onesignalEnabled,
        onesignalAppId,
        posts,
        apps,
        videos,
        courses,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          ...CORS_HEADERS,
        },
      }
    );
  } catch (e) {
    return Response.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
