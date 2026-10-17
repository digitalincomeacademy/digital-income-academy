"use client";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "@/hooks/useCollection";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";

function MessagesInner() {
  const { data, loading } = useCollection("messages");
  const { toast } = useToast();

  const remove = async (row) => {
    if (!confirm(`"${row.name || row.phone}" এর মেসেজ মুছে ফেলবেন?`)) return;
    try {
      await deleteDoc(doc(db, "messages", row.id));
      toast.success("মেসেজ মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error("মুছতে ব্যর্থ: " + (e.message || e));
    }
  };

  const fmt = (r) => {
    const d = r.createdAt?.toDate ? r.createdAt.toDate() : null;
    return d ? d.toLocaleString("bn-BD") : "—";
  };

  const columns = [
    { key: "name", label: "নাম", render: (r) => r.name || "—" },
    { key: "phone", label: "ফোন", render: (r) => r.phone || "—" },
    {
      key: "message",
      label: "মেসেজ",
      render: (r) => (
        <span title={r.message || ""} className="block max-w-xs truncate text-slate-300">
          {r.message || "—"}
        </span>
      ),
    },
    { key: "createdAt", label: "তারিখ", render: fmt },
  ];

  return (
    <DataTable
      columns={columns}
      rows={loading ? [] : data}
      onEdit={() => {}}
      onDelete={remove}
      emptyText={loading ? "লোড হচ্ছে..." : "কোনো মেসেজ নেই।"}
    />
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="মেসেজসমূহ">
        <MessagesInner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
