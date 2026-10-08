"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, BarChart3 } from "lucide-react";
import { normCourse } from "@/lib/siteData";

const bn = (n) => Number(n).toLocaleString("bn-BD");

export default function CourseCard({ course: rawCourse }) {
  const course = normCourse(rawCourse || {});
  const discount = course.oldPrice > course.price
    ? Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)
    : 0;
  return (
    <motion.article
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-3xl overflow-hidden group flex flex-col"
    >
      <div className="relative">
        {course.imageUrl ? (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-navy-800 flex items-center justify-center">
            <span className="text-4xl font-head font-extrabold text-brand-400/40">{course.title?.slice(0, 2)}</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-gold-400 text-navy-950 text-sm font-bold px-3 py-1">
            {bn(discount)}% ছাড়
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold">{course.title}</h3>
        <p className="mt-2 text-slate-300 line-clamp-3 text-sm">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-brand-400" />{course.duration}</span>
          )}
          {course.level && (
            <span className="inline-flex items-center gap-1.5"><BarChart3 size={15} className="text-brand-400" />{course.level}</span>
          )}
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-extrabold text-gold-400">৳{bn(course.price ?? 0)}</span>
            {course.oldPrice > course.price && (
              <span className="ml-2 line-through text-slate-500">৳{bn(course.oldPrice)}</span>
            )}
          </div>
          <Link href={`/courses/${course.slug}`} className="btn btn-primary !min-h-[40px] !px-5 text-sm">
            বিস্তারিত
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
