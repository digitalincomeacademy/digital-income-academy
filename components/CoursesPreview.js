"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/useCollection";
import { normCourse } from "@/lib/siteData";
import SectionHeading from "./SectionHeading";

const bn = (n) => Number(n).toLocaleString("bn-BD");

export default function CoursesPreview() {
  const { data, loading } = useCollection("courses", (c) => c.active !== false);
  return (
    <section className="py-16 md:py-24 bg-navy-900">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="আমাদের কোর্সসমূহ" sub="শুরু থেকে প্রফেশনাল লেভেল পর্যন্ত ধাপে ধাপে শিখুন।" />
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">{[0, 1].map((i) => <div key={i} className="skeleton h-80" />)}</div>
        ) : data.length === 0 ? (
          <p className="glass rounded-2xl p-8 text-slate-300">কোর্স শীঘ্রই যুক্ত হবে। অ্যাডমিন প্যানেল থেকে কোর্স যোগ করুন।</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {data.map((raw) => {
              const c = normCourse(raw);
              return (
              <motion.article key={c.id} whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }} className="glass rounded-3xl overflow-hidden group">
                {c.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={c.imageUrl} alt={c.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-slate-300 line-clamp-3">{c.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-gold-400">৳{bn(c.price)}</span>
                      {c.oldPrice > c.price && <span className="ml-2 line-through text-slate-500">৳{bn(c.oldPrice)}</span>}
                    </div>
                    <Link href={`/courses/${c.slug}`} className="btn btn-primary !min-h-[40px] text-sm">বিস্তারিত</Link>
                  </div>
                </div>
              </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
