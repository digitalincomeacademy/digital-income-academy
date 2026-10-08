import Hero from "@/components/Hero";
import CoursesSection from "@/components/CoursesSection";
import ToolsSection from "@/components/ToolsSection";
import VideosSection from "@/components/VideosSection";
import PostsSection from "@/components/PostsSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import SearchModal from "@/components/SearchModal";
import ExternalLinkNotice from "@/components/ExternalLinkNotice";

export default function Home() {
  return (
    <>
      <Hero />
      <CoursesSection />
      <ToolsSection />
      <VideosSection />
      <PostsSection />
      <AboutSection />
      <TeamSection />
      <SearchModal />
      <ExternalLinkNotice />
    </>
  );
}
