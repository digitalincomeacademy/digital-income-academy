"use client";
import { useMemo } from "react";
import { BookOpen, Video, Wrench, Smartphone, ClipboardList, Mail } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCollection } from "@/hooks/useCollection";

function ts(v) {
  if (!v) return 0;
  if (typeof v.toDate === "function") return v.toDate().getTime();
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function fmtDate(v) {
  if (!v) return "—";
  const d = v.toDate ? v.toDate() : new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("bn-BD");
}

function enrollBadge(status) {
  if (status === "approved")
    return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">অনুমোদিত</span>;
  if (status === "rejected")
    return <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">প্রত্যাখ্যাত</span>;
  return <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">অপেক্ষমাণ</span>;
}

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-navy-900 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-400/15 text-brand-400">
          <Icon size={22} />
        </span>
        <div>
          <p className="text-xs text-white/60">{label}</p>
          <p className="font-head text-3xl font-bold text-white">
            {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" /> : value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Inner() {
  const { data: courses, loading: lc } = useCollection("courses");
  const { data: videos, loading: lv } = useCollection("videos");
  const { data: tools, loading: lt } = useCollection("tools");
  const { data: apps, loading: la } = useCollection("apps");
  const { data: enrollments, loading: le } = useCollection("enrollments");
  const { data: messages, loading: lm } = useCollection("messages");

  const recentEnrollments = useMemo(
    () => [...enrollments].sort((a, b) => ts(b.createdAt) - ts(a.createdAt)).slice(0, 5),
    [enrollments]
  );
  const recentMessages = useMemo(
    () => [...messages].sort((a, b) => ts(b.createdAt) - ts(a.createdAt)).slice(0, 5),
    [messages]
  );

  const stats = [
    { icon: BookOpen, label: "মোট কোর্স", value: courses.length, loading: lc },
    { icon: Video, label: "মোট ভিডিও", value: videos.length, loading: lv },
    { icon: Wrench, label: "মোট টুল", value: tools.length, loading: lt },
    { icon: Smartphone, label: "মোট অ্যাপ", value: apps.length, loading: la },
    { icon: ClipboardList, label: "মোট এনরোলমেন্ট", value: enrollments.length, loading: le },
    { icon: Mail, label: "মোট মেসেজ", value: messages.length, loading: lm },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-navy-900 p-5">
          <h2 className="font-head text-base font-bold text-white">সাম্প্রতিক এনরোলমেন্ট</h2>
          <div className="mt-4 space-y-3">
            {le ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
              ))
            ) : recentEnrollments.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/50">এখনো কোনো এনরোলমেন্ট আসেনি</p>
            ) : (
              recentEnrollments.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-navy-950 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{r.name || "—"}</p>
                    <p className="truncate text-xs text-white/50">
                      {r.phone || "—"} • {r.courseSlug || r.course || "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {enrollBadge(r.status)}
                    <span className="text-[11px] text-white/40">{fmtDate(r.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-navy-900 p-5">
          <h2 className="font-head text-base font-bold text-white">সাম্প্রতিক মেসেজ</h2>
          <div className="mt-4 space-y-3">
            {lm ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
              ))
            ) : recentMessages.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/50">এখনো কোনো মেসেজ আসেনি</p>
            ) : (
              recentMessages.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-white/5 bg-navy-950 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">{r.name || "অজ্ঞাত"}</p>
                    <span className="shrink-0 text-[11px] text-white/40">{fmtDate(r.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-white/60">
                    {r.message || r.text || "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="ড্যাশবোর্ড">
        <Inner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
