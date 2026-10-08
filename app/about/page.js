import { Target, Eye, HeartHandshake, BookOpenCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const blocks = [
  {
    icon: Target, title: "আমাদের লক্ষ্য",
    text: "বাংলাদেশের প্রতিটি আগ্রহী মানুষের কাছে পৌঁছে দেওয়া বাস্তব, হাতে-কলমে শেখার মতো ডিজিটাল স্কিল — যাতে যে কেউ নিজের যোগ্যতায় অনলাইনে কাজ করার পথ তৈরি করতে পারে।",
  },
  {
    icon: Eye, title: "আমাদের দৃষ্টিভঙ্গি",
    text: "এমন একটি কমিউনিটি গড়ে তোলা যেখানে শেখা মানে শুধু ভিডিও দেখা নয় — বরং বাস্তব প্রজেক্ট, সৎ পরামর্শ আর একে অপরের পাশে দাঁড়ানো।",
  },
  {
    icon: BookOpenCheck, title: "শেখার পদ্ধতি",
    text: "সহজ বাংলায়, ধাপে ধাপে, বাস্তব উদাহরণ দিয়ে। প্রতিটি কোর্স এমনভাবে সাজানো যাতে একজন সম্পূর্ণ নতুন শিক্ষার্থীও শুরু থেকে শেষ পর্যন্ত এগিয়ে যেতে পারে।",
  },
  {
    icon: HeartHandshake, title: "সৎ শেখার দর্শন",
    text: "আমরা কখনো আয়ের নিশ্চয়তা দিই না, ভুয়া স্ক্রিনশট বা সাজানো সাফল্যের গল্প দেখাই না। আয় নির্ভর করে আপনার দক্ষতা, কাজের মান, প্রচেষ্টা ও ফলাফলের ওপর — এই সত্যটা আমরা শুরুতেই বলে দিই।",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          title="আমাদের সম্পর্কে"
          sub="Digital Income Academy — বাংলায় বাস্তব ডিজিটাল স্কিল শেখার বিশ্বস্ত ঠিকানা।"
        />
        <div className="grid md:grid-cols-2 gap-6">
          {blocks.map((b, i) => (
            <Reveal key={b.title} className="glass rounded-3xl p-7 md:p-8">
              <span className="inline-flex rounded-2xl bg-brand-400/10 text-brand-400 p-3">
                <b.icon size={26} />
              </span>
              <h3 className="mt-4 text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-slate-300">{b.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 glass rounded-3xl p-7 md:p-10 text-center">
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
            "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে" — এটা শুধু ট্যাগলাইন নয়, আমাদের প্রতিটি
            কোর্স, প্রতিটি ভিডিও আর প্রতিটি পরামর্শের ভিত্তি।
          </p>
        </Reveal>
      </div>
    </div>
  );
}
