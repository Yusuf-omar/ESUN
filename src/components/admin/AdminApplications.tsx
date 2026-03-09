"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import type { ServiceType } from "@/lib/types";
import { updateApplicationStatus } from "@/app/admin/actions";
import { getServiceLabels } from "@/lib/i18n";
import { useI18n } from "@/components/providers/I18nProvider";

interface AppRow {
  id: string;
  user_id: string;
  service_type: ServiceType;
  description: string;
  status: string;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminApplications({ list }: { list: AppRow[] }) {
  const { copy } = useI18n();
  const serviceLabels = getServiceLabels(copy);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(list.map((a) => [a.id, a.status]))
  );
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleStatusChange = async (id: string, status: string) => {
    setError("");
    setUpdating(id);
    try {
      await updateApplicationStatus(id, status);
      setStatuses((s) => ({ ...s, [id]: status }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update application status.";
      setError(msg);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {list.length === 0 ? (
        <p className="text-white/60">No applications.</p>
      ) : (
        list.map((app) => (
          <motion.div
            key={app.id}
            layout
            className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-white">
                {serviceLabels[app.service_type]}
              </span>
              <span className="text-sm text-white/50">
                {formatDate(app.created_at)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
              {app.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(["pending", "in_progress", "resolved"] as const).map(
                (status) => (
                  <TapButton
                    key={status}
                    variant={statuses[app.id] === status ? "primary" : "outline"}
                    className="py-1.5 px-3 text-sm"
                    disabled={updating === app.id}
                    onClick={() => handleStatusChange(app.id, status)}
                  >
                    {status.replace("_", " ")}
                  </TapButton>
                )
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
