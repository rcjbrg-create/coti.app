"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText } from "lucide-react";

interface Props {
  totalDishes: number;
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  stationCount: number;
  checklistCount: number;
}

export function DashboardStats({ totalDishes, publishedCount, draftCount }: Props) {
  return (
    <div className="px-4 mb-4">
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Pratos</h2>
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-surface rounded-2xl border border-border text-center hover:shadow-lg transition-shadow"
        >
          <p className="text-3xl font-bold text-text">{totalDishes}</p>
          <p className="text-xs text-text-muted mt-1">Total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle size={14} className="text-green-600" />
            <p className="text-3xl font-bold text-green-700">{publishedCount}</p>
          </div>
          <p className="text-xs text-green-600 mt-1">Publicados</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200 text-center hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <FileText size={14} className="text-yellow-600" />
            <p className="text-3xl font-bold text-yellow-700">{draftCount}</p>
          </div>
          <p className="text-xs text-yellow-600 mt-1">Rascunhos</p>
        </motion.div>
      </div>
    </div>
  );
}
