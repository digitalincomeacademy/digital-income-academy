"use client";
import { useState } from "react";
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "@/hooks/useCollection";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, X, ChevronUp, ChevronDown, Trash2, Save } from "lucide-react";

const LEVELS = ["বিগিনার", "ইন্টারমিডিয়েট", "অ্যাডভান্সড", "সব লেভেল"];

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  duration: "",
  level: "বিগিনার",
  image: "",
  featured: false,
  active: true,
  order: 0,
  curriculum: [],
};

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function CurriculumEditor({ curriculum, setCurriculum }) {
  const addModule = () => setCurriculum([...curriculum, { title: "", lessons: [] }]);
  const updateModule = (i, patch) =>
    setCurriculum(curriculum.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const removeModule = (i) => setCurriculum(curriculum.filter((_, idx) => idx !== i));
  const moveModule = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= curriculum.length) return;
    const next = [...curriculum];
    [next[i], next[j]] = [next[j], next[i]];
    setCurriculum(next);
  };
  const addLesson = (i) =>
    setCurriculum(curriculum.map((m, idx) => (idx === i ? { ...m, lessons: [...m.lessons, ""] } : m)));
  const updateLesson = (i, li, val) =>
    setCurriculum(
      curriculum.map((m, idx) =>
        idx === i ? { ...m, lessons: m.lessons.map((l, j) => (j === li ? val : l)) } : m
      )
    );
  const removeLesson = (i, li) =>
    setCurriculum(
      curriculum.map((m, idx) =>
        idx === i ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m
      )
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">কারিকুলাম</label>
        <button
          type="button"
          onClick={addModule}
          className="inline-flex items-center gap-1 rounded-lg bg-navy-800 px-3 py-1.5 text-xs text-brand-400 hover:bg-navy-700"
        >
          <Plus size={14} /> মডিউল যোগ করুন
        </button>
      </div>
      {curriculum.length === 0 && (
        <p className="text-xs text-slate-500">এখনো কোনো মডিউল নেই।</p>
      )}
      {curriculum.map((mod, i) => (
        <div key={i} className="rounded-xl border border-navy-800 bg-navy-900/60 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={mod.title}
              onChange={(e) => updateModule(i, { title: e.target.value })}
              placeholder={`মডিউল ${i + 1} এর শিরোনাম`}
              className="flex-1 rounded-lg bg-navy-950 border border-navy-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
            />
            <button type="button" onClick={() => moveModule(i, -1)} className="p-1.5 text-slate-400 hover:text-brand-400" title="উপরে">
              <ChevronUp size={16} />
            </button>
            <button type="button" onClick={() => moveModule(i, 1)} className="p-1.5 text-slate-400 hover:text-brand-400" title="নিচে">
              <ChevronDown size={16} />
            </button>
            <button type="button" onClick={() => removeModule(i)} className="p-1.5 text-slate-400 hover:text-red-400" title="মুছুন">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="space-y-1.5 pl-4">
            {mod.lessons.map((lesson, li) => (
              <div key={li} className="flex items-center gap-2">
                <input
                  value={lesson}
                  onChange={(e) => updateLesson(i, li, e.target.value)}
                  placeholder={`লেসন ${li + 1}`}
                  className="flex-1 rounded-lg bg-navy-950 border border-navy-800 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => removeLesson(i, li)}
                  className="p-1.5 text-slate-500 hover:text-red-400"
                  title="মুছুন"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addLesson(i)}
              className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline"
            >
              <Plus size={13} /> লেসন যোগ করুন
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoursesInner() {
  const { data, loading } = useCollection("courses");
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, curriculum: [] });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title || "",
      slug: row.slug || "",
      description: row.description || "",
      price: row.price || "",
      oldPrice: row.oldPrice || "",
      duration: row.duration || "",
      level: row.level || "বিগিনার",
      image: row.image || row.imageUrl || "",
      featured: !!row.featured,
      active: row.active !== false,
      order: row.order ?? 0,
      curriculum: Array.isArray(row.curriculum) ? row.curriculum : [],
    });
    setShowModal(true);
  };

  const handleTitle = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: f.slug === "" || f.slug === slugify(f.title) ? slugify(v) : f.slug,
    }));
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("শিরোনাম আবশ্যক");
    if (!form.slug.trim()) return toast.error("স্লাগ আবশ্যক");
    if (!db) return toast.error("Firebase সংযোগ নেই");
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        oldPrice: form.oldPrice.trim(),
        duration: form.duration.trim(),
        level: form.level,
        image: form.image,
        featured: !!form.featured,
        active: !!form.active,
        order: Number(form.order) || 0,
        curriculum: (form.curriculum || []).map((m) => ({
          title: (m.title || "").trim(),
          lessons: (m.lessons || []).map((l) => (l || "").trim()).filter((l) => l !== ""),
        })),
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), payload);
        toast.success("কোর্স আপডেট হয়েছে");
      } else {
        await addDoc(collection(db, "courses"), { ...payload, createdAt: serverTimestamp() });
        toast.success("নতুন কোর্স যোগ হয়েছে");
      }
      setShowModal(false);
    } catch (e) {
      toast.error("সংরক্ষণ ব্যর্থ: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!confirm(`"${row.title}" মুছে ফেলবেন?`)) return;
    try {
      await deleteDoc(doc(db, "courses", row.id));
      toast.success("কোর্স মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error("মুছতে ব্যর্থ: " + (e.message || e));
    }
  };

  const inputCls =
    "w-full rounded-lg bg-navy-950 border border-navy-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-brand-400 focus:outline-none";

  const columns = [
    {
      key: "image",
      label: "ছবি",
      render: (r) =>
        r.image ? (
          <img src={r.image} alt={r.title} className="h-10 w-16 rounded object-cover" />
        ) : (
          <span className="text-slate-600 text-xs">—</span>
        ),
    },
    { key: "title", label: "শিরোনাম" },
    { key: "price", label: "মূল্য", render: (r) => r.price || "—" },
    {
      key: "featured",
      label: "ফিচার্ড",
      render: (r) =>
        r.featured ? (
          <span className="rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs text-gold-400">ফিচার্ড</span>
        ) : (
          <span className="text-slate-600 text-xs">—</span>
        ),
    },
    {
      key: "active",
      label: "অবস্থা",
      render: (r) =>
        r.active !== false ? (
          <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs text-green-400">সক্রিয়</span>
        ) : (
          <span className="rounded-full bg-slate-500/15 px-2.5 py-0.5 text-xs text-slate-400">নিষ্ক্রিয়</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-navy-950 hover:opacity-90"
        >
          <Plus size={16} /> নতুন কোর্স
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={loading ? [] : data}
        onEdit={openEdit}
        onDelete={remove}
        emptyText={loading ? "লোড হচ্ছে..." : "কোনো কোর্স নেই।"}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-navy-800 bg-navy-900 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-head text-lg font-bold text-slate-100">
                {editingId ? "কোর্স সম্পাদনা" : "নতুন কোর্স"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-400">শিরোনাম *</label>
                <input value={form.title} onChange={(e) => handleTitle(e.target.value)} className={inputCls} placeholder="কোর্সের নাম" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">স্লাগ *</label>
                <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={inputCls} placeholder="course-slug" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">বর্ণনা</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} placeholder="কোর্স সম্পর্কে সংক্ষেপে..." />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">মূল্য</label>
                <input value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="৳১,৯৯৯" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">পুরনো মূল্য</label>
                <input value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} className={inputCls} placeholder="৳২,৯৯৯" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">মেয়াদ</label>
                <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="৩ মাস" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">লেভেল</label>
                <select value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">ক্রম</label>
                <input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className={inputCls} />
              </div>
              <div className="flex items-end gap-4 pb-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-gold-400" />
                  ফিচার্ড
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-brand-400" />
                  সক্রিয়
                </label>
              </div>
            </div>

            <ImageUpload value={form.image} onChange={(v) => set("image", v)} label="কোর্সের ছবি" />

            <CurriculumEditor
              curriculum={form.curriculum}
              setCurriculum={(c) => set("curriculum", c)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-navy-800 px-4 py-2 text-sm text-slate-300 hover:bg-navy-800"
              >
                বাতিল
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-navy-950 hover:opacity-90 disabled:opacity-50"
              >
                <Save size={16} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="কোর্সসমূহ">
        <CoursesInner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
