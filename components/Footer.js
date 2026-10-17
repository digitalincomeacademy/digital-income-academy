"use client";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import SocialIcons from "@/components/SocialIcons";
import { useSettings } from "@/hooks/useSettings";
import { socialsToLinks } from "@/lib/siteData";



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
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {academyName}
              </h3>
              <span className="text-xs text-emerald-400 font-medium">{slogan}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            অনলাইন ইনকাম, আধুনিক ওয়েবসাইট ডিজাইন, ডিজিটাল মার্কেটিং এবং ক্যারিয়ার
            উপযোগী ডিজিটাল টুলসের জন্য একটি বিশ্বস্ত প্ল্যাটফর্ম। সততা ও দক্ষতার
            সাথে নিজের ভবিষ্যৎ গড়ে তুলুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm pt-1">
            {settings?.contactEmail && (
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            )}
            {settings?.contactPhone && (
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
            )}
            {settings?.contactAddress && (
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.contactAddress}</span>
              </div>
            )}
          </div>

          <div className="pt-1">
            <span className="text-xs text-slate-500 font-medium block mb-3">
              আমাদের সাথে যুক্ত থাকুন
            </span>
            <div className="flex justify-center">
              <SocialIcons links={socialLinks} size="md" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {settings?.footerText || "© 2026 Digital Income Academy. সর্বস্বত্ব সংরক্ষিত।"}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              শর্তাবলী
            </Link>
            <span className="flex items-center gap-1">
              <span>সততা ও নিষ্ঠার সাথে পরিচালিত</span>
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
