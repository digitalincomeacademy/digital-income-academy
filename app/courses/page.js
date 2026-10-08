"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import SectionHeading from "@/components/SectionHeading";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";

export default function CoursesPage() {
  const { data, loading } = useCollection("courses", (c) => c.active !== false);
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((c) =>
      [c.title, c.description, c.level].filter(Boolean).join(" ").toLowerCase().includes(s)
    );
  }, [data, q]);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          title="সব কোর্স"
          sub="শুরু থেকে প্রফেশনাল লেভেল পর্যন্ত — হাতে-কলমে শিখুন, নিজের গতিতে এগিয়ে যান।"
        />
        <Reveal className="relative max-w-md mb-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="কোর্স খুঁজুন…"
            className="w-full glass rounded-full pl-11 pr-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500"
          />
        </Reveal>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-96" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-lg text-slate-300">
              {data.length === 0
                ? "এই মুহূর্তে কোনো কোর্স প্রকাশিত হয়নি। শিগগিরই আসছে।"
                : "খুঁজে পাওয়া যায়নি। অন্য কিছু লিখে চেষ্টা করুন।"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {list.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
