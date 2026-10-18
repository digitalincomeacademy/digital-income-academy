import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// false হলে সাইট ডেটা ছাড়াই (খালি অবস্থায়) চলবে, বিল্ড ফেল করবে না
export const firebaseReady = Boolean(config.apiKey && config.projectId);

const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const db = app ? getFirestore(app) : null;
// auth/storage শুধু দরকারের সময় তৈরি হবে (অ্যাডমিন প্যানেলে ব্যবহার হবে)
export const getAuthInstance = () => (app ? getAuth(app) : null);
export const getStorageInstance = () => (app ? getStorage(app) : null);
