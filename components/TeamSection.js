"use client";
import { Users, Mail, Send } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSettings } from "@/hooks/useSettings";
import { normMember } from "@/lib/siteData";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

export default function TeamSection() {
  const { data, loading } = useCollection("team", (m) => m.active !== false);
  const { settings } = useSettings();
  const teamMembers = data.map(normMember);

  if (!loading && (settings?.enableTeamSection === false || teamMembers.length === 0)) {
    return null;
  }

  return (
    <section id="team" className="py-16 md:py-24 bg-slate-900/30 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>আমাদের টিম</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            দক্ষ ও নিবেদিতপ্রাণ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300">
              মেন্টর প্যানেল
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            আপনাকে সঠিক গন্তব্যে পৌঁছে দিতে আমাদের অভিজ্ঞ প্রশিক্ষক ও সাপোর্ট টিম
            সবসময় পাশে আছে।
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative rounded-2xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col items-center text-center hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative w-28 h-28 mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-500/40 p-1 group-hover:border-emerald-400 transition-colors">
                    <img
                      src={member.photoUrl || FALLBACK_PHOTO}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PHOTO;
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-emerald-400 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {member.position}
                </span>

                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {member.bio}
                </p>

                {member.links && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80 w-full flex items-center justify-center gap-3">
                    {member.links.facebook && (
                      <a
                        href={member.links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-colors"
                        title="Facebook"
                        aria-label={`${member.name} Facebook`}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {member.links.telegram && (
                      <a
                        href={member.links.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-[#229ED9] hover:bg-[#229ED9]/10 transition-colors"
                        title="Telegram"
                        aria-label={`${member.name} Telegram`}
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    )}
                    {member.links.email && (
                      <a
                        href={`mailto:${member.links.email}`}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Email"
                        aria-label={`${member.name} Email`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
