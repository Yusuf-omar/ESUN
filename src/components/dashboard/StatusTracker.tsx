"use client";

import { motion } from "framer-motion";
import { SERVICE_LABELS } from "@/lib/types";
import type { ServiceType } from "@/lib/types";
import { AR } from "@/lib/ar";

interface AppRow {
  id: string;
  service_type: ServiceType;
  description: string;
  status: string;
  created_at: string;
}

const STATUS_STEPS = ["pending", "in_progress", "resolved"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: AR.dashboard.pending,
  in_progress: AR.dashboard.inProgress,
  resolved: AR.dashboard.resolved,
};

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StatusTracker({ applications }: { applications: AppRow[] }) {
  const d = AR.dashboard;
  return (
    <section className="glass rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d]/80 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60">
      <h2 className="text-lg font-bold text-white">{d.statusTracker}</h2>
      <p className="mt-1 text-sm text-white/70">
        {d.statusTrackerSub}
      </p>
      {applications.length === 0 ? (
        <p className="mt-6 text-white/60">{d.noApplications}</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {applications.map((app, i) => (
            <motion.li
              key={app.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[#8c7656]/30 bg-[#120f0d]/80 p-4 transition-all duration-300 hover:border-[#c9ad84]/55"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">
                  {SERVICE_LABELS[app.service_type as ServiceType]}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    app.status === "resolved"
                      ? "bg-green-500/20 text-green-400"
                      : app.status === "in_progress"
                        ? "bg-[#8c7656]/30 text-[#8c7656]"
                        : "bg-white/10 text-white/80"
                  }`}
                >
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-white/70">
                {app.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {STATUS_STEPS.map((step, j) => {
                  const idx = STATUS_STEPS.indexOf(app.status as typeof STATUS_STEPS[number]);
                  const active = j <= idx;
                  return (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full ${
                        active ? "bg-[#a81123]" : "bg-white/10"
                      }`}
                      title={step}
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/50">
                {formatDate(app.created_at)}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
