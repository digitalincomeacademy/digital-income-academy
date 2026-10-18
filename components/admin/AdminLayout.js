"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Video,
  Wrench,
  Smartphone,
  Megaphone,
  Award,
  HelpCircle,
  ClipboardList,
  Mail,
  Settings,
  FileText,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Newspaper,
  Image as ImageIcon,
  Users,
  Radio,
} from "lucide-react";
import { getAuthInstance } from "@/lib/firebase";

const NAV_ITEMS = [
  { path: "/ceo-rifat-panel", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { path: "/ceo-rifat-panel/courses", label: "কোর্স", icon: BookOpen },
  { path: "/ceo-rifat-panel/videos", label: "ভিডিও", icon: Video },
  { path: "/ceo-rifat-panel/tools", label: "টুলস", icon: Wrench },
  { path: "/ceo-rifat-panel/apps", label: "অ্যাপস", icon: Smartphone },
  { path: "/ceo-rifat-panel/posts", label: "পোস্ট", icon: Newspaper },
  { path: "/ceo-rifat-panel/team", label: "টিম", icon: Users },
  { path: "/ceo-rifat-panel/live", label: "লাইভ", icon: Radio },
  { path: "/ceo-rifat-panel/announcements", label: "ঘোষণা", icon: Megaphone },
  { path: "/ceo-rifat-panel/notice", label: "নোটিশ ব্যানার", icon: ImageIcon },
  { path: "/ceo-rifat-panel/success-stories", label: "সফলতার গল্প 🌟", icon: Award },
  { path: "/ceo-rifat-panel/testimonials", label: "মতামত", icon: MessageSquare },
  { path: "/ceo-rifat-panel/faqs", label: "জিজ্ঞাসা", icon: HelpCircle },
  { path: "/ceo-rifat-panel/enrollments", label: "এনরোলমেন্ট", icon: ClipboardList },
  { path: "/ceo-rifat-panel/purchases", label: "ক্রয়সমূহ 🛒", icon: ClipboardList },
  { path: "/ceo-rifat-panel/messages", label: "মেসেজ", icon: Mail },
  { path: "/ceo-rifat-panel/terms", label: "শর্তাবলী", icon: FileText },
  { path: "/ceo-rifat-panel/settings", label: "সেটিংস", icon: Settings },
];

function isActive(pathname, itemPath) {
  if (itemPath === "/ceo-rifat-panel") return pathname === "/ceo-rifat-panel";
  return pathname === itemPath || pathname.startsWith(itemPath + "/");
}

export default function AdminLayout({ children, title }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || "");
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    const auth = getAuthInstance();
    if (auth) await signOut(auth);
    router.push("/ceo-rifat-panel/login");
  };

  const navList = (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 font-body text-sm font-medium transition ${
              active
                ? "bg-navy-800 text-brand-400"
                : "text-slate-300 hover:bg-navy-800/60 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
            {active && <span className="ml-auto h-2 w-2 rounded-full bg-brand-400" />}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-navy-900 lg:flex">
        <div className="border-b border-white/10 p-5">
          <p className="font-head text-lg font-bold text-white">Digital Income Academy</p>
          <p className="font-body text-xs text-slate-400">অ্যাডমিন প্যানেল</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">{navList}</nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate font-body text-xs text-slate-400">{userEmail || "অ্যাডমিন"}</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-900 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <p className="font-head text-lg font-bold text-white">Digital Income Academy</p>
                  <p className="font-body text-xs text-slate-400">অ্যাডমিন প্যানেল</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-slate-400 transition hover:text-white"
                  aria-label="মেনু বন্ধ করুন"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-4">{navList}</nav>
              <div className="border-t border-white/10 p-4">
                <p className="truncate font-body text-xs text-slate-400">
                  {userEmail || "অ্যাডমিন"}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-navy-950/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-slate-300 transition hover:text-white lg:hidden"
              aria-label="মেনু খুলুন"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-head text-xl font-bold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 font-body text-sm text-slate-300 transition hover:border-brand-400/40 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">সাইট দেখুন</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-2 font-body text-sm font-medium text-red-400 transition hover:bg-red-500/25"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
