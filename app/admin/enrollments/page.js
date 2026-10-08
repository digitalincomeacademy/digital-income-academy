"use client";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "@/hooks/useCollection";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";

const STATUS_OPTS = [
  { value: "pending", label: "অপেক্ষমাণ" },
  { value: "confirmed", label: "কনফার্মড" },
  { value: "cancelled", label: "বাতিল" },
];

function statusBadge(s) {
  if (s === "confirmed")
    return <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs text-green-400">কনফার্মড</span>;
  if (s === "cancelled")
    return <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs text-red-400">বাতিল</span>;
  return <span className="rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs text-gold-400">অপেক্ষমাণ</span>;
}

function EnrollmentsInner() {
  const { data, loading } = useCollection("enrollments");
  const { toast } = useToast();

  const setStatus = async (row, value) => {
    try {
      await updateDoc(doc(db, "enrollments", row.id), { status: value });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
    } catch (e) {
      toast.error("আপডেট ব্যর্থ: " + (e.message || e));
    }
  };

  const remove = async (row) => {
    if (!confirm(`"${row.name || row.phone}" এর এনরোলমেন্ট মুছে ফেলবেন?`)) return;
    try {
      await deleteDoc(doc(db, "enrollments", row.id));
      toast.success("এনরোলমেন্ট মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error("মুছতে ব্যর্থ: " + (e.message || e));
    }
  };

  const fmt = (r) => {
    const d = r.createdAt?.toDate ? r.createdAt.toDate() : null;
    return d ? d.toLocaleString("bn-BD") : "—";
  };

  const columns = [
    { key: "name", label: "নাম" },
    { key: "phone", label: "ফোন" },
    { key: "courseSlug", label: "কোর্স", render: (r) => r.courseSlug || "—" },
    { key: "trxId", label: "TrxID", render: (r) => r.trxId || "—" },
    { key: "createdAt", label: "তারিখ", render: fmt },
    {
      key: "status",
      label: "স্ট্যাটাস",
      render: (r) => (
        <div className="flex items-center gap-2">
          {statusBadge(r.status)}
          <select
            value={r.status || "pending"}
            onChange={(e) => setStatus(r, e.target.value)}
            className="rounded-lg bg-navy-950 border border-navy-800 px-2 py-1 text-xs text-slate-200"
          >
            {STATUS_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={loading ? [] : data}
      onEdit={() => toast.success("স্ট্যাটাস ড্রপডাউন থেকে পরিবর্তন করুন")}
      onDelete={remove}
      emptyText={loading ? "লোড হচ্ছে..." : "কোনো এনরোলমেন্ট নেই।"}
    />
  );
}

export default function EnrollmentsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="এনরোলমেন্ট">
        <EnrollmentsInner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
