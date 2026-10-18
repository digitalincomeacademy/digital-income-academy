"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";

export default function ThemeToggle({ className = "" }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    try {
      setLight(localStorage.getItem(THEME_KEY) === "light");
    } catch {}
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    try {
      localStorage.setItem(THEME_KEY, next ? "light" : "dark");
    } catch {}
    document.documentElement.classList.toggle("theme-light", next);
  };

  return (
    <button
      onClick={toggle}
      title={light ? "ডার্ক মোড" : "লাইট মোড"}
      aria-label={light ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন"}
      className={`inline-flex items-center justify-center w-7 h-7 sm:w-auto sm:h-auto sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-all ${className}`}
    >
      {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
