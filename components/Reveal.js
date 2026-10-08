"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function Reveal({ children, className = "", as = "div" }) {
  const Comp = motion[as];
  return (
    <Comp variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className={className}>
      {children}
    </Comp>
  );
}
