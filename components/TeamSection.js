"use client";
import { Users } from "lucide-react";
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
    <section id="team" className="py-10 md:py-14 bg-slate-900/30 relative border-t border-slate-800/80">
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative card card-hover p-6 flex flex-col items-center text-center hover:border-cyan-500/40"
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
                    {member.links.whatsapp && (
                      <a
                        href={`https://wa.me/${member.links.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                        title="WhatsApp"
                        aria-label={`${member.name} WhatsApp`}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
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
