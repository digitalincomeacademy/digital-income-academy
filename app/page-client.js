"use client";
import React from "react";
import Hero from "@/components/Hero";
import CoursesSection from "@/components/CoursesSection";
import ToolsSection from "@/components/ToolsSection";
import VideosSection from "@/components/VideosSection";
import PostsSection from "@/components/PostsSection";
import SuccessStories from "@/components/SuccessStories";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import AppsSection from "@/components/AppsSection";
import AiToolsSection from "@/components/AiToolsSection";
import SearchModal from "@/components/SearchModal";
import ExternalLinkNotice from "@/components/ExternalLinkNotice";
import { useSettings } from "@/hooks/useSettings";

const SECTION_MAP = {
  courses: <CoursesSection />,
  tools: <ToolsSection />,
  videos: <VideosSection />,
  posts: <PostsSection />,
  success: <SuccessStories />,
  apps: <AppsSection />,
  about: <AboutSection />,
  team: <TeamSection />,
  aitools: <AiToolsSection />,
};

const DEFAULT_ORDER = ["courses", "success", "tools", "videos", "posts", "apps", "about", "team", "aitools"];

export default function Home() {
  const { settings } = useSettings();
  const order = settings?.sectionOrder?.length ? settings.sectionOrder : DEFAULT_ORDER;
  const visibility = settings?.sectionVisibility || {};
  // Filter to known sections, keep default order for any missing, skip hidden
  const seen = new Set();
  const ordered = [
    ...order.filter((k) => SECTION_MAP[k] && !seen.has(k) && (seen.add(k), true)),
    ...DEFAULT_ORDER.filter((k) => !seen.has(k)),
  ].filter((k) => visibility[k] !== false);
  // Trust signal: always keep Success Stories prominent — right after courses
  // (admin can still hide it via section visibility toggle).
  const finalOrder =
    visibility.success === false || !ordered.includes("success")
      ? ordered
      : [
          ...ordered.filter((k) => k !== "success").slice(0, 1),
          "success",
          ...ordered.filter((k) => k !== "success").slice(1),
        ];

  return (
    <>
      <Hero />
      {finalOrder.map((key) => (
        <React.Fragment key={key}>
          {SECTION_MAP[key]}
        </React.Fragment>
      ))}
      <SearchModal />
      <ExternalLinkNotice />
    </>
  );
}
