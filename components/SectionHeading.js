"use client";
import { motion } from "framer-motion";

export default function SectionHeading({ title, sub }) {
  return (
    <div className="mb-10 md:mb-14 max-w-2xl">
      <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
      <motion.span
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="block h-1 w-24 mt-4 origin-left rounded-full bg-gradient-to-r from-brand-400 to-gold-400"
      />
      {sub && <p className="mt-4 text-slate-300 text-lg">{sub}</p>}
    </div>
  );
}
