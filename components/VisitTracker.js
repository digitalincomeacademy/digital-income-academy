"use client";
import { useEffect } from "react";
import { trackTotalVisit } from "@/lib/visitors";

// layout.js থেকে একবার মাউন্ট হয় — প্রতি সেশনে একবার মোট ভিজিট গোনে
export default function VisitTracker() {
  useEffect(() => {
    trackTotalVisit();
  }, []);
  return null;
}
