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
  { value: "approved", label: "অনুমোদিত" },
  { value: "rejected", label: "বাতিল" },
];

function statusBadge(s) {
  if (s === "approved")
    return <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs text-green-400">অনুমোদিত</span>;
  if (s === "rejected")
    return <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs text-red-400">বাতিল</span>;
  return <span className="rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs text-gold-400">অপেক্ষমাণ</span>;
}

const TYPE_LABELS = { course: "কোর্স", tool: "টুল", app: "অ্যাপ" };

function PurchasesInner() {
  const { data, loading } = useCollection("purchases", () => true, { orderByField: "createdAt", orderDir: "desc" });
  const { toast } = useToast();

  const setStatus = async (row, value) => {
    try {
      await updateDoc(doc(db, "purchases", row.id), { status: value });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
    } catch (e) {
      toast.error("আপডেট ব্যর্থ: " + (e.message || e));
    }
  };

  const remove = async (row) => {
    if (!confirm(`"${row.name || row.phone}" এর ক্রয় মুছে ফেলবেন?`)) return;
    try {
      await deleteDoc(doc(db, "purchases", row.id));
      toast.success("মুছে ফেলা হয়েছে");
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
    {
      key: "itemTitle",
      label: "আইটেম",
      render: (r) => (
        <span>
          <span className="text-xs text-slate-400">[{TYPE_LABELS[r.itemType] || r.itemType}] </span>
          {r.itemTitle}
        </span>
      ),
    },
    {
      key: "price",
      label: "মূল্য",
      render: (r) => `${r.price || "—"} ${r.currency || ""}`,
    },
    { key: "trxId", label: "TrxID", render: (r) => <span className="font-mono text-xs">{r.trxId || "—"}</span> },
    {
      key: "downloadUrl",
      label: "ডাউনলোড",
      render: (r) =>
        r.downloadUrl ? (
          <a href={r.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-xs">
            লিংক ↗
          </a>
        ) : (
          <span className="text-slate-500 text-xs">—</span>
        ),
    },
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
      emptyText={loading ? "লোড হচ্ছে..." : "কোনো ক্রয় নেই।"}
    />
  );
}

export default function PurchasesPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="ক্রয়সমূহ (Buy Now)">
        <PurchasesInner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
