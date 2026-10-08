"use client";

import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { getStorageInstance } from "@/lib/firebase";

export default function ImageUpload({ value, onChange, label }) {
  const [mode, setMode] = useState("link"); // "link" | "upload"
  const [urlInput, setUrlInput] = useState("");
  const [progress, setProgress] = useState(null); // null = idle, 0-100 = uploading
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const isUrl = (s) => /^https?:\/\/.+\..+/.test((s || "").trim());

  const applyUrl = () => {
    setError("");
    const u = urlInput.trim();
    if (!isUrl(u)) {
      setError("সঠিক ছবির লিংক দিন (https:// দিয়ে শুরু)।");
      return;
    }
    onChange(u);
    setUrlInput("");
  };

  const handleFile = (file) => {
    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP ইত্যাদি) আপলোড করুন।");
      return;
    }

    const storage = getStorageInstance();
    if (!storage) {
      setError("স্টোরেজ সেবা উপলব্ধ নেই — আপাতত উপরের লিংক অপশন ব্যবহার করুন।");
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageRef = ref(storage, `uploads/${Date.now()}_${safeName}`);
    const task = uploadBytesResumable(storageRef, file);

    setProgress(0);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err) => {
        setProgress(null);
        setError("আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          setProgress(null);
          onChange(url);
        } catch (err) {
          setProgress(null);
          setError("আপলোড সম্পন্ন হলেও লিংক পাওয়া যায়নি। আবার চেষ্টা করুন।");
        }
      }
    );
  };

  const uploading = progress !== null;

  return (
    <div>
      {label && <p className="mb-2 font-body text-sm font-medium text-slate-200">{label}</p>}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="ছবি"
            className="max-h-48 rounded-xl border border-white/10 object-cover"
            onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
            aria-label="ছবি সরান"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="mt-1 max-w-[280px] truncate font-body text-xs text-slate-500">{value}</p>
        </div>
      ) : (
        <div>
          {/* Mode tabs */}
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => { setMode("link"); setError(""); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs font-semibold transition ${
                mode === "link"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              লিংক দিন
            </button>
            <button
              type="button"
              onClick={() => { setMode("upload"); setError(""); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs font-semibold transition ${
                mode === "upload"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              আপলোড করুন
            </button>
          </div>

          {mode === "link" ? (
            <div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
                  placeholder="https://i.postimg.cc/... (ছবির Direct Link)"
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 font-body text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyUrl}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 font-body text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  বসান
                </button>
              </div>
              <p className="mt-2 font-body text-xs text-slate-500">
                postimages.org বা imgbb.com-এ ছবি আপলোড করে Direct Link এখানে বসান — সাইট হালকা থাকবে।
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-slate-900 px-6 py-8 font-body text-sm text-slate-300 transition hover:border-emerald-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ImageIcon className="h-8 w-8 text-emerald-400" />
              {uploading ? "আপলোড হচ্ছে..." : "ছবি নির্বাচন করুন"}
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 font-body text-xs text-slate-400">{progress}%</p>
        </div>
      )}

      {error && <p className="mt-2 font-body text-sm text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
