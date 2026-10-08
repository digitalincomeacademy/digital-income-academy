"use client";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";
import SocialIcons from "@/components/SocialIcons";
import { useSettings } from "@/hooks/useSettings";
import { socialsToLinks } from "@/lib/siteData";

function scrollTo(id) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const QUICK_LINKS = [
  { label: "হোম পেজ", id: null },
  { label: "কোর্সসমূহ", id: "courses" },
  { label: "ডিজিটাল টুলস", id: "tools" },
  { label: "ভিডিও গাইডলাইন", id: "videos" },
  { label: "সাম্প্রতিক পোস্ট", id: "posts" },
  { label: "আমাদের সম্পর্কে", id: "about" },
  { label: "আমাদের টিম", id: "team" },
];

export default function Footer() {
  const { settings } = useSettings();
  const academyName = settings?.academyName || "Digital Income Academy";
  const slogan =
    settings?.slogan || settings?.tagline || "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে";
  const socialLinks = socialsToLinks(settings?.socials);

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm relative overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {academyName}
                </h3>
                <span className="text-xs text-emerald-400 font-medium">{slogan}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md pt-2">
              অনলাইন ইনকাম, আধুনিক ওয়েবসাইট ডিজাইন, ডিজিটাল মার্কেটিং এবং ক্যারিয়ার
              উপযোগী ডিজিটাল টুলসের জন্য একটি বিশ্বস্ত প্ল্যাটফর্ম। সততা ও দক্ষতার
              সাথে নিজের ভবিষ্যৎ গড়ে তুলুন।
            </p>

            <div className="pt-2">
              <span className="text-xs text-slate-500 font-medium block mb-2">
                আমাদের সাথে যুক্ত থাকুন:
              </span>
              <SocialIcons links={socialLinks} size="md" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 tracking-wider uppercase">
              গুরুত্বপূর্ণ লিংক
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() =>
                      l.id ? scrollTo(l.id) : window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 tracking-wider uppercase">
              যোগাযোগ ও ঠিকানা
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              {settings?.contactEmail && (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{settings.contactEmail}</span>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
              )}
              {settings?.contactAddress && (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{settings.contactAddress}</span>
                </div>
              )}
              {!settings?.contactEmail && !settings?.contactPhone && !settings?.contactAddress && (
                <p className="text-slate-500 text-xs">
                  যোগাযোগের তথ্য শীঘ্রই যুক্ত করা হবে।
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {settings?.footerText || "© 2026 Digital Income Academy. সর্বস্বত্ব সংরক্ষিত।"}
          </p>
          <div className="flex items-center gap-1">
            <span>সততা ও নিষ্ঠার সাথে পরিচালিত</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
