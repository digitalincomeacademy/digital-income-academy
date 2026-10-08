"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2, TriangleAlert } from "lucide-react";

export default function DataTable({ columns, rows, onEdit, onDelete, emptyText }) {
  const [deleteRow, setDeleteRow] = useState(null);

  const handleConfirmDelete = () => {
    if (deleteRow && onDelete) onDelete(deleteRow);
    setDeleteRow(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-navy-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-body text-sm font-semibold text-slate-200"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-body text-sm font-semibold text-slate-200">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="bg-navy-900">
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center font-body text-sm text-slate-400"
                >
                  {emptyText || "কোনো ডেটা পাওয়া যায়নি।"}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-t border-white/5 bg-navy-900 transition hover:bg-navy-800/50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 font-body text-sm text-slate-200">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-lg bg-brand-400/15 p-2 text-brand-400 transition hover:bg-brand-400/30"
                          aria-label="এডিট করুন"
                          title="এডিট করুন"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteRow(row)}
                          className="rounded-lg bg-red-500/15 p-2 text-red-400 transition hover:bg-red-500/30"
                          aria-label="মুছুন"
                          title="মুছুন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteRow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setDeleteRow(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-navy-900 p-6 text-center"
            >
              <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-red-400" />
              <h3 className="mb-2 font-head text-lg font-bold text-white">আপনি কি নিশ্চিত?</h3>
              <p className="mb-6 font-body text-sm text-slate-300">
                এই আইটেমটি স্থায়ীভাবে মুছে যাবে এবং ফিরিয়ে আনা যাবে না।
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteRow(null)}
                  className="flex-1 rounded-lg border border-white/15 px-4 py-2.5 font-body text-sm font-medium text-slate-200 transition hover:bg-white/5"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  মুছুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
